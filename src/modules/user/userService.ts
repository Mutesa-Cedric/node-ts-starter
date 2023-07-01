import User from "./userModel";

export const findUser = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (err) {
        console.error(`Error finding user: ${err}`);
        throw err;
    }
}

export const findUserById = async (id: string) => {
    try {
        const user = User.findById(id);
        return user;
    } catch (error) {
        console.error(`Error finding user: ${error}`);
        throw error;
    }
}

export const createUser = async (name: string, email: string, password: string) => {
    try {
        const user = await User.create({
            name,
            email,
            password,
        });
        return user;
    } catch (err) {
        console.error(`Error creating user: ${err}`);
        throw err;
    }
}
