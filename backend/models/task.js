module.exports=(sequelize , DataTypes) =>{
    const task = sequelize.define("task", {
        taskid : {
            type : DataTypes.INTEGER,
            primaryKey : true,
             autoIncrement : true
        },
        username : {
            type:DataTypes.STRING,
            allowNull:false,
           
        },
        userid:{
            type:DataTypes.INTEGER,
        },
      
        description:{
          type: DataTypes.STRING,
          defaultValue: 'Default description'
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
       
    },
    {
        tableName : "task",
        timestamps : false
    })
    return task;
}