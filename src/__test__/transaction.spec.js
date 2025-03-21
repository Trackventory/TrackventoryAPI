const { 
  stockUp,
  sellOut,
  getAllTransactions,
  getTransactionById,
  getTransactionByType
} = require("../controllers/transactionController");
const Product = require("../models/product");
const Transaction = require("../models/transaction");

jest.mock("../models/product");
jest.mock("../models/transaction");

describe("Transaction controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      params: {},
      userInfo: { id: "user123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  it("returns 200 when stock is updated for an existing product", async () => {
    req.body = { 
      productId: "existingProduct123",
      quantity: 5
    };

    const mockProduct = {
      _id: "existingProduct123",
      quantity: 10,
      save: jest.fn().mockResolvedValue(true),
    };

    Product.findById.mockResolvedValue(mockProduct);
    Transaction.create.mockResolvedValue({ _id: "trans123" });

    Product.findById.mockResolvedValue(mockProduct);
    Transaction.create.mockResolvedValue({ _id: "trans123", product: "existingProduct123", quantity: 5 });
    Transaction.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: "trans123",
        product: mockProduct,
        quantity: 5,
      }),
    });

    await stockUp(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Stock updated successfully",
      data: expect.any(Object),
    });
  });


  it("returns 200 when a new product is created successfully", async () => {
    req.body = {
      name: "New Product",
      description: "Test Description",
      price: 100,
      quantity: 10,
      image: "test.jpg",
      category: "Test Category",
    };

    Product.findOne.mockResolvedValue(null);
    Product.create.mockResolvedValue({ _id: "newProd123", ...req.body });
    Transaction.create.mockResolvedValue({ _id: "trans123", product: "newProd123", quantity: 10 });
    Transaction.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        _id: "trans123",
        product: { _id: "newProd123", ...req.body },
        quantity: 10,
      }),
    });

    await stockUp(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Stock updated successfully",
      data: expect.any(Object),
    });
  });


  it("returns 400 when quantity is missing from sell-out request body", async () => {
    req.body = { productId: "prod123" }; // quantity is missing
  
    await sellOut(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Product ID and quantity are required!',
    });
  });

  
  it("returns 400 when no transactions are found in the database", async () => {
    Transaction.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      }),
    });
  
    await getAllTransactions(req, res);
  
    expect(Transaction.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "No transactions found!",
    });
  });

  
  it("should return 200 when transaction is found", async () => {
    req.params = { id: "trans123" };
  
    const mockTransaction = {
      _id: "trans123",
      user: { firstName: "John", lastName: "Doe", email: "john@example.com", _id: "user123" },
      product: { _id: "prod123", name: "Product 1", category: "Category 1" },
      quantity: 5,
      type: "stock_up",
    };
  
    Transaction.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTransaction),
      }),
    });
  
    await getTransactionById(req, res);
  
    expect(Transaction.findById).toHaveBeenCalledWith("trans123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Operation successful!',
      data: mockTransaction,
    });
  });


  it("should return 400 when transaction type is missing from request params", async () => {
    req.params = {};
    await getTransactionByType(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide a transaction type!',
    });
  });
});