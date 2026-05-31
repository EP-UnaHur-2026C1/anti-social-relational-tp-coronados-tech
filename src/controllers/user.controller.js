const HTTP = require("../config/HttpCode");
const { User } = require("../db/models");
const followerService = require("../services/follower.service");

const createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.status(HTTP.CREATED).json(user);
};

const getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.status(HTTP.OK).json(users);
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.status(HTTP.OK).json(user);
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    await user.update(req.body);
    res.status(HTTP.OK).json(user);
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    await user.destroy();
    res.status(HTTP.OK).json({ message: res.__("delete_user", { id }) });
};

const getUserFollowers = async (req, res) => {
    const { id } = req.params;
    const followers = await followerService.getFollowers(id);
    res.status(HTTP.OK).json(followers);
};

const getUserFollowing = async (req, res) => {
    const { id } = req.params;
    const following = await followerService.getFollowing(id);
    res.status(HTTP.OK).json(following);
};

const followUser = async (req, res) => {
    const { id } = req.params;
    const { follower_id } = req.body;
    const result = await followerService.follow(id, follower_id);

    if (result?.selfFollow) {
        return res.status(HTTP.BAD_REQUEST).json({
            message: res.__("cannot_follow_self"),
        });
    }

    if (!result) {
        return res.status(HTTP.NOT_FOUND).json({
            message: res.__("follow_users_not_found"),
        });
    }

    res.status(HTTP.CREATED).json({
        message: res.__("follow_success"),
        following_id: Number(id),
        follower_id: Number(follower_id),
    });
};

const unfollowUser = async (req, res) => {
    const { id } = req.params;
    const { follower_id } = req.body;
    const result = await followerService.unfollow(id, follower_id);

    if (!result) {
        return res.status(HTTP.NOT_FOUND).json({
            message: res.__("follow_users_not_found"),
        });
    }

    res.status(HTTP.OK).json({
        message: res.__("unfollow_success"),
        following_id: Number(id),
        follower_id: Number(follower_id),
    });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserFollowers,
    getUserFollowing,
    followUser,
    unfollowUser,
};
