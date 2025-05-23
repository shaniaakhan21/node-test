const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        const meeting = new MeetingHistory(req.body);
        await meeting.save();
        res.status(201).json(meeting);
    } catch (err) {
        res.status(400).json({ error: 'Failed to add meeting', details: err });
    }
}

const index = async (req, res) => {
    try {
        const meetings = await MeetingHistory.find({ deleted: false })
            .populate('attendes')
            .populate('attendesLead')
            .populate('createBy');

        res.status(200).json(meetings);
    } catch (err) {
        console.error('❌ Meeting index error:', err.message);
        res.status(500).json({ error: 'Failed to fetch meetings', details: err.message });
    }
};

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id)
            .populate('attendes attendesLead createBy');
        if (!meeting || meeting.deleted) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        const formatted = {
            ...meeting._doc,
            createdByName: meeting.createBy
                ? `${meeting.createBy.firstName || ''} ${meeting.createBy.lastName || ''}`.trim()
                : 'Unknown',
        };
        res.status(200).json(formatted);
    } catch (err) {
        console.error('Meeting view error:', err);
        res.status(500).json({ error: 'Failed to fetch meeting' });
    }
}

const deleteData = async (req, res) => {
    try {
        const updated = await MeetingHistory.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
        res.status(200).json({ message: 'Meeting deleted', data: updated });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete meeting' });
    }
}

const deleteMany = async (req, res) => {
     try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'No IDs provided for deletion.' });
    }

    const result = await MeetingHistory.updateMany(
      { _id: { $in: ids } },
      { $set: { deleted: true } }
    );

    res.status(200).json({ message: 'Meetings deleted', result });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete meetings', details: err.message });
  }
}

module.exports = { add, index, view, deleteData, deleteMany }