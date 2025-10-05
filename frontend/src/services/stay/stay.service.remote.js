import { httpService } from '../http.service.js'
import { userService } from '../user/index.js'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}

async function query(filterBy = {}) {
    try {
        const queryParams = {}

        if (filterBy.location) queryParams.location = filterBy.location
        if (filterBy.checkIn) queryParams.checkIn = filterBy.checkIn
        if (filterBy.checkOut) queryParams.checkOut = filterBy.checkOut
        if (filterBy.guests) queryParams.guests = JSON.stringify(filterBy.guests)

        return await httpService.get('stay', queryParams)
    } catch (err) {
        console.error('Cannot query stays:', err)
        throw err
    }
}

function getById(stayId) {
    return httpService.get(`stay/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
}

async function save(stay) {
    let savedStay
    if (stay._id) {
        // update
        const stayToSave = {
            _id: stay._id,
            name: stay.name,
            price: stay.price,
            loc: stay.loc,
            capacity: stay.capacity,
        }
        savedStay = await httpService.put(`stay/${stay._id}`, stayToSave)
    } else {
        // create
        const stayToSave = {
            name: stay.name,
            price: stay.price,
            loc: stay.loc,
            capacity: stay.capacity,
            host: userService.getLoggedinUser(),
            msgs: []
        }
        savedStay = await httpService.post('stay', stayToSave)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    const savedMsg = await httpService.post(`stay/${stayId}/msg`, { txt })
    return savedMsg
}
