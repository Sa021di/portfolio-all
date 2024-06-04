const { Model, Sequelize, DataTypes } = require("sequelize");
const logger = require("../../services/logger.service");
const validateLinks = require("../../utils/validateLinks");

class JapanLanguageTest extends Model {}

module.exports = (sequelize) => {
    try {
        JapanLanguageTest.init({
            id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                unique: true,
            },
            name: {
                type: DataTypes.ENUM(['JLPT', 'NAT']),
                allowNull: false
            },
            level: {
                type: DataTypes.ENUM(['0', 'N1', 'N2', 'N3', 'N4', 'N5', 'Q1', 'Q2', 'Q3', 'Q4']),
                defaultValue: '0'
            },
            listening: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            reading: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            writing: {
                type: DataTypes.INTEGER,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            sertificate: {
                type: DataTypes.STRING,
                validate: {
                    validateLinks
                }
            }
        }, {
            sequelize,
            timestamps: false,
            modelName: 'JapanLanguageTests'
        })

        JapanLanguageTest.associate = (models) => {
            models.JapanLanguageTests.belongsTo(models.Students, {
                foreignKey: {
                    name: 'studentId',
                    allowNull: false
                },
                onDelete: 'cascade',
                as: 'student'
            })
        }

        return JapanLanguageTest
    } catch (error) {
        logger.error(error.message)
    }
}
