const Team = require('../models/TeamSchema')

const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; 
    const team = new Team({
      name,
      description,
      members: [{ userId, role: "owner" }]
    });

    await team.save();
    res.status(201).json({ message: "Team created successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Error creating team", error });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("members.userId", "name email");
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate(
      "members.userId",
      "name email"
    );
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team", error });
  }
};

const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: "Team not found" });

    
    if (team.members.some((m) => m.userId.toString() === userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push({ userId, role });
    await team.save();

    res.status(200).json({ message: "Member added successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error });
  }
};

const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: "Team not found" });

    team.members = team.members.filter(
      (m) => m.userId.toString() !== userId
    );

    await team.save();
    res.status(200).json({ message: "Member removed successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Error removing member", error });
  }
};

const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json({ message: "Team updated successfully", team });
  } catch (error) {
    res.status(500).json({ message: "Error updating team", error });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting team", error });
  }
};


module.exports = {
  createTeam,
  getTeams,
  getTeamById,
  addMember,
  removeMember,
  updateTeam, 
  deleteTeam
};