const jwt = require("jsonwebtoken");
const { UserModel } = require("../database/entities/User");



/**
 * Creates a JWT based on a given instance of a User model.
 * 
 * JWTs made in this function will expire after 24 hours.
 */
function generateJWT(targetUser, response) {
	let tokenBody = {
		userId: targetUser.id
	}

    //Make sure a JWT_SECRET key has been added to the .env
	if (!process.env.JWT_SECRET) {
		throw new Error("Server environment configuration failure on token creation.");
	}

	let freshJwt = jwt.sign(
		// Custom payload data, should be an object containing whatever JSON data you want.
		tokenBody,
		// JWT secret key, should come from the environment variables.
		process.env.JWT_SECRET,
		// JWT standard data such as its expiration time, 
		{
			expiresIn: "1d"
		}
	);

	// save new jwt to cookie
	response.cookie("authcookie", freshJwt, {
		httpOnly: true,
		maxAge: 36000000,
		secure: true,	
		sameSite: "None"
	});	

	return freshJwt;
}




/**
 * Returns an object and user for a given JWT, if the JWT is valid.
 */
async function validateJWT(targetJwt) {
	if (!process.env.JWT_SECRET) {
		throw new Error("Server environment configuration failure on token validation.");
	}

	// Synchronously confirm if the JWT is legitimate AND hasn't expired yet:
	let validJwt = jwt.verify(targetJwt, process.env.JWT_SECRET);
	// console.log(JSON.stringify(validJwt, null, 4));

	// Make sure the JWT is a valid user and not a random one
	let tokenUser = await UserModel.findOne({_id: validJwt.userId});

	if (!tokenUser || tokenUser == null) {
		throw new Error("User not found for provided token.");
	}

	return {
		decodedValidToken: validJwt,
		tokenUser: tokenUser
	}
}


module.exports = {
	generateJWT, 
    validateJWT
}