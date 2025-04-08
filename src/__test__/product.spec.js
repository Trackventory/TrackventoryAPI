const { getAllProducts, getProductById } = require("../controllers/productController");
const Product = require("../models/product");
const bcrypt = require("bcryptjs");

jest.mock("../models/product");

describe("Product controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      userInfo: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  it('returns error message when no products are found in the database', async () => {
    Product.find.mockResolvedValue([]);

    await getAllProducts(req, res);

    expect(Product.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No products found!'
    });
  });


  it("returns message when the product ID is not a valid MongoDB ObjectId", async () => {
    req.params = { id: 'invalid-id' };
  
    await getProductById(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid product ID'
    });
  });

});