const sha256 = require("sha256");
const { Model, DataTypes, Sequelize } = require("sequelize");
const { roles } = require("../../constants/server.constants");
const logger = require("../../services/logger.service");
const validateLinks = require("../../utils/validateLinks");

class Decan extends Model {}

module.exports = (sequelize) => {
	try {
		Decan.init(
			{
				id: {
					type: DataTypes.UUID,
					allowNull: false,
					defaultValue: Sequelize.UUIDV4,
					primaryKey: true,
					unique: true,
				},
				firstName: {
					type: DataTypes.STRING,
				},
				lastName: {
					type: DataTypes.STRING,
				},
				loginId: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						isUnique: async function (value) {
							const recruitor = await sequelize.models.Students.findOne({
								where: { loginId: value },
							});
							if (recruitor) {
								throw new Error("loginId must be unique");
							}

							const student = await sequelize.models.Students.findOne({
								where: { loginId: value },
							});
							if (student) {
								throw new Error("loginId must be unique");
							}

							const teacher = await sequelize.models.Teachers.findOne({
								where: { loginId: value },
							});
							if (teacher) {
								throw new Error("loginId must be unique");
							}
						},
					},
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						len: 8,
					},
				},
				email: {
					type: DataTypes.STRING,
				},
				role: {
					type: DataTypes.ENUM(roles.DECAN),
					allowNull: false,
					defaultValue: roles.DECAN,
				},
				avatar: {
					type: DataTypes.STRING,
					validate: {
						validateLinks,
					},
				},
				isDeleted: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
				},
			},
			{
				sequelize,
				modelName: "Decan",
				hooks: {
					beforeCreate: (model) => {
						const values = model.dataValues;
						if (values?.password) {
							model.password = sha256(values.password);
						}
					},
					beforeUpdate: (model) => {
						const values = model.dataValues;
						if (model._previousDataValues?.password !== values?.password) {
							model.password = sha256(values.password);
						}
					},
					beforeBulkUpdate: (model) => {
						const values = model.attributes;
						if (model._previousDataValues?.password !== values?.password) {
							model.password = sha256(values?.password);
						}
					},
				},
			},
		);

		return Decan;
	} catch (error) {
		logger.error(error.message);
	}
};
