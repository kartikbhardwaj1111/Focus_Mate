const express = require('express');
const router = express.Router();
const {createTask, getTasks, updateTask, deleteTask} = require('../controllers/Task');
const {signup, login, googleAuth} = require('../controllers/Auth');
const userAuth = require('../middleware');
const {getStats, updateStats} = require('../controllers/Stats');
const {createTeam, getTeams, getTeamById, addMember, removeMember, updateTeam, deleteTeam} = require('../controllers/Team');
const {sendUser, updateUser} = require('../controllers/User');

//Authentication
router.post('/auth/register', signup);
router.post('/auth/login', login);
router.post('/auth/logout', require('../controllers/Auth').logout);

//User
router.get('/user', userAuth, sendUser);
router.put('/user', userAuth, updateUser);

//Tasks
router.post('/tasks', userAuth, createTask);
router.get('/tasks', userAuth, getTasks);
router.put('/tasks/:id', userAuth, updateTask);
router.delete('/tasks/:id', userAuth, deleteTask);
router.patch('/tasks/:id', userAuth, updateTask); 


//Stats
router.get('/stats', userAuth, getStats);
router.put('/stats/:id', userAuth, updateStats);

//Teams
router.post('/teams', userAuth, createTeam);
router.get('/teams', userAuth, getTeams);
router.get('/teams/:id', userAuth, getTeamById);
router.post('/teams/:id', userAuth, addMember);
router.delete('/teams/remove/:id', userAuth, removeMember);
router.put('/teams/:id', userAuth, updateTeam);
router.delete('/teams/:id', userAuth, deleteTeam);

module.exports = router;