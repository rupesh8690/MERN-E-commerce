import Product from "../models/product.model.js";

export const getCartProducts = async(req,res) =>{
    try{
        const products = await Product.find({_id:{$in:req.user.cartItems}});//return all documents whose _id is in the array req.user.cartItems.

        //add quantity for each products
        const cartItems =products.map(product =>{
            const item= req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return {...product.toJSON(), quantity:item.quantity} // give quantity for each product

        })
      res.json(cartItems);

    }catch(error){
        return res.status(500).json({message:"Server error",error:error.message})
    }
}
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user; //since this is a proteceted route where we set the user so we can access here
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart Controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user; //since this is a proteceted route where we set the user so we can access here
     
    if(!productId){
        user.cartItems =[];// if not product id found return the empty cart items;
    }
    else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);

    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
  
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async(req,res) =>{
    try{
        const {id:productId} = req.params; // id is renamed with productId
        const {quantity} = req.body;
        const user=req.user;
        const existingItem = user.cartItems.find((item) => item.id === productId);
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            }

            existingItem.quantity = quantity;
            await user.save();
            res.json(user.cartItems);

        }else{
            res.status(404).json({message:"Produc not found"});

        }

    }catch(error){
    res.status(500).json({ message: "Server error", error: error.message });

    }
}

