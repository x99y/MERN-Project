const { default: mongoose } = require("mongoose");


async function dbConnect() {
	try {
		let targetDatabaseUrl = process.env.MONGODB_DATABASE_URL || "mongodb://mongo:27017/DatingAppDatabase";
		console.log("Connecting to database: " + targetDatabaseUrl);
		await mongoose.connect(targetDatabaseUrl);
		console.log("Database connected!");
	} catch (error) {
		console.log("Database connection failed!\n" + JSON.stringify(error));
		// dont deploy if database connection fails
		process.exit(1);
	}
}


async function dbClose() {
	await mongoose.connection.close();
	console.log("Database disconnected!");
}

module.exports = {
	dbConnect, dbClose
}