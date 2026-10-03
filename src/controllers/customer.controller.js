const prisma = require("../config/prisma");

// CREATE
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, status, assignedTo } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        status: status || "LEAD",
        assignedTo: assignedTo || null,
        companyId: req.user.companyId, // tenant scoping on write
      },
    });

    res.status(201).json({ message: "Customer created", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// LIST (with search, filter, pagination)
exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, search = "", status } = req.query;
    const take = 10;
    const skip = (Number(page) - 1) * take;

    const where = {
      companyId: req.user.companyId, // tenant scoping on read — the core of multi-tenancy
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(status && { status }),
    };

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);

    res.status(200).json({
      customers,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET ONE
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: { id, companyId: req.user.companyId }, // prevents cross-tenant access by ID
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// UPDATE
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, assignedTo } = req.body;

    const existing = await prisma.customer.findFirst({
      where: { id, companyId: req.user.companyId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone, status, assignedTo },
    });

    res.status(200).json({ message: "Customer updated", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// DELETE
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.customer.findFirst({
      where: { id, companyId: req.user.companyId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await prisma.customer.delete({ where: { id } });

    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};