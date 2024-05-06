module.exports=(Sequelize,Datatypes)=>{
    const users=Sequelize.define('users',{
        userid:{
            type:Datatypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        username:{
            type:Datatypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type:Datatypes.STRING,
            allowNull:false,
           
        }
    },
    {   tableName:'users',
        updatedAt:'updatedAt',
        createdAt:'createdAt'
    })
    return users;
}