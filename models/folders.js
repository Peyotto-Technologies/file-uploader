module.exports = function (sequelize, DataTypes) {
    var Folders = sequelize.define('Folders', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        path: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        parent_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'folders',
        timestamps: true,
        getterMethods: {}
    });

    return Folders;
};
