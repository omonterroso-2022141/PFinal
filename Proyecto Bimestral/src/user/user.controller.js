'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../../utils/validator.js'
import { generateJwt } from '../../utils/jwt.js'



export const adminDefault = async (req, res) => {
    try {
        let userExist = await User.findOne({ username: 'oscarin' })
        if (!userExist) {
            let data = {
                name: 'Oscarin',
                surname: 'Monterroso',
                username: 'oscarin',
                email: 'oscarin@gmail.com',
                password: '123456',
                role: 'ADMIN'
            }
            data.password = await encrypt(data.password)
            let user = new User(data)
            await user.save()
        }
        return res.status(200).send({ message: 'Administrator added successfully' })
    } catch (err) {
    }
}


export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'CLIENT'
        let user = new User(data)
        await user.save()

        return res.send({ message: 'Registered successfully' })

    } catch (err) {
        console.error(err)

    }
}

export const login = async (req, res) => {
    try {

        let { username, password, email } = req.body
        let user = await User.findOne({
            $or: [
                {
                    username: username
                }, {
                    email: email
                }
            ]
        })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }

            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }

        return res.status(404).send({ message: 'Invalid credentials' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed to login' })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const update = checkUpdate(data, id);
        if (!update) {
            return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        }
        const userRole = req.user.role;
        if (userRole !== 'ADMIN' && req.user.uid !== id) {
            return res.status(403).send({ message: 'Unauthorized: Only the same user or an admin can update this account' });
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(401).send({ message: 'User not found and not updated' });
        }

        return res.send({ message: 'User updated successfully', updatedUser });
    } catch (err) {
        console.error(err);
        if (err.keyValue.username) {
            return res.status(400).send({ message: `Username ${err.keyValue.username} is already taken` });
        }
        return res.status(500).send({ message: 'Error updating account' });
    }
};


export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params
        let deletedUser = await User.findOneAndDelete({ _id: id })

        if (!deletedUser) return res.status(404).send({ message: 'Acount not found and not deleted' })
        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting account' })

    }
}