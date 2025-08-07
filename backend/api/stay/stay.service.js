import { GridFSBucket, ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const stayService = {
    remove,
    query,
    getById,
    add,
    update,
    addStayMsg,
    removeStayMsg,
}

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        logger.info('Query criteria:', criteria)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

// async function query(filterBy = { txt: '' }) {
//     try {
//         const criteria = _buildCriteria(filterBy)
//         const sort = _buildSort(filterBy)

//         const collection = await dbService.getCollection('stay')
//         var stayCursor = await collection.find(criteria, { sort })

//         if (filterBy.pageIdx !== undefined) {
//             stayCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
//         }

//         const stays = stayCursor.toArray()

//         return stays
//     } catch (err) {
//         logger.error('cannot find stays', err)
//         throw err
//     }
// }

async function getById(stayId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(stayId) }
        const collection = await dbService.getCollection('stay')
        const stay = await collection.findOne(criteria)
        stay.createdAt = stay._id.getTimestamp()
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const { _id: ownerId, isAdmin } = loggedinUser

    try {
        const criteria = {
            _id: ObjectId.createFromHexString(stayId),
        }

        if (!isAdmin) criteria['host._id'] = ownerId

        const collection = await dbService.getCollection('stay')
        const res = await collection.deleteOne(criteria)

        if (res.deletedCount === 0) throw ('Not your stay')
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)

        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay) {
    try {
        const stayToUpdate = { ...stay }
        delete stayToUpdate._id

        const criteria = { _id: ObjectId.createFromHexString(stay._id) }
        const collection = await dbService.getCollection('stay')
        await collection.updateOne(criteria, { $set: stayToUpdate })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

async function addStayMsg(stayId, msg) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(stayId) }
        msg.id = makeId()

        const collection = await dbService.getCollection('stay')
        await collection.updateOne(criteria, { $push: { msgs: msg } })

        return msg
    } catch (err) {
        logger.error(`cannot add stay msg ${stayId}`, err)
        throw err
    }
}

async function removeStayMsg(stayId, msgId) {
    try {
        const criteria = { _id: ObjectId.createFromHexString(stayId) }

        const collection = await dbService.getCollection('stay')
        await collection.updateOne(criteria, { $pull: { msgs: { id: msgId } } })

        return msgId
    } catch (err) {
        logger.error(`cannot remove stay msg ${stayId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    logger.info('Building criteria for filterBy:', filterBy)

    if (filterBy.location) {
        const regex = new RegExp(filterBy.location, 'i')
        criteria.$or = [
            { 'name': regex }, // Search in name field (like local service)
            { 'loc.address': regex }, // Search in address field
            { 'loc.city': regex }, // Search in city field
            { 'loc.country': regex }, // Search in country field
        ]
        logger.info('Location criteria:', criteria.$or)
    }

    if (filterBy.guests && typeof filterBy.guests === 'object') {
        const totalGuests = (Number(filterBy.guests.adults) || 0) + (Number(filterBy.guests.children) || 0)
        if (totalGuests > 0) {
            criteria.capacity = { $gte: totalGuests }
        }
    }

    // filter by Dates
    if (filterBy.checkIn && filterBy.checkOut) {
        criteria['availability.availableDates'] = {
            $elemMatch: {
                startDate: { $lte: filterBy.checkOut },
                endDate: { $gte: filterBy.checkIn },
            },
        };
    }

    logger.info('Final criteria:', criteria)
    return criteria
}