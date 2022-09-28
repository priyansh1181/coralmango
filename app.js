const express=require('express');
const app=express();
const sequelize=require('./util/database');
const Restaurant=require('./models/restaurant');
const Review=require('./models/review');
const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get('/home',async(req,res)=>{

    const restaurants = await Restaurant.findAll();

    let data=restaurants.map(restaurant=>{
        return{
            id:restaurant.id,
            name:restaurant.name,
            address:restaurant.address
        }
    });
    
    


    res.status(200).json({data});
})

app.get('/restaurant/:id',async(req,res)=>{
    const id=req.params.id;
    let data=await Restaurant.findByPk(id);
    let restaurant = {
        id:data.id,
        name:data.name,
        address:data.address,
        description : data.description ,
    }
     
    console.log(restaurant);
    let results=await data.getReviews();
    let reviews = results.map((result =>{

        return  {
            id : results.id,
            review : results.review
        }
    }))

    res.send({
        "Restaurant":restaurant,
        "Reviews":reviews
    });

})

app.post('/restaurant/:id',async(req,res)=>
{
    const id=req.params.id;
    let restaurant=await Restaurant.findByPk(id);
    await restaurant.createReview({
        review:req.body.review
    })
    res.send({msg : `review added Successfully` });

})
app.get('/admin',async(req,res,next)=>{

    let restaurants=await Restaurant.findAll();
    let data=[];

    for(let i=0;i<restaurants.length;i++)
    {
        let obj={};
        let reviews= await restaurants[i].getReviews();
        obj['id']=restaurants[i].id
        obj['Name']=restaurants[i].name;
        obj['Reviews count']=reviews.length;
        data.push(obj);

    }
    res.json({data});

})



Restaurant.hasMany(Review)
Review.belongsTo(Restaurant);


sequelize.sync()
.then((res)=>{
    console.log("Database connected");
    app.listen(3000);

})
.catch((err)=>{
    console.log(err)
});
