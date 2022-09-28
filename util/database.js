const Sequelize=require('sequelize');


const sequelize=new Sequelize('companyassesment','root','nishu123',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize; 