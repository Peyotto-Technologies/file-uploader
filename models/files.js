module.exports = function (sequelize, DataTypes) {
    var Files = sequelize.define('Files', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_path: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        folder_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        mimetype: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thumbnail_path: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: 'files',
        timestamps: true,
        getterMethods: {}
    });

    return Files;
};
