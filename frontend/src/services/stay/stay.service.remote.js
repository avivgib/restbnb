import { httpService } from '../http.service.js'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}

// async function query(filterBy = {}) {
//     return httpService.get('stay', filterBy)
// }

async function query(filterBy = {}) {
    try {
        const queryParams = {
            location: filterBy.location || '',
            checkIn: filterBy.checkIn || '',
            checkOut: filterBy.checkOut || '',
            guests: filterBy.guests ? JSON.stringify(filterBy.guests) : '',
        };
        // console.log('Query params before sending:', queryParams)
        return await httpService.get('stay', queryParams);
    } catch (err) {
        console.error('Cannot query stays:', err);
        throw err;
    }
}

function getById(stayId) {
    return httpService.get(`stay/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
}

async function save(stay) {
    var savedStay
    if (stay._id) {
        savedStay = await httpService.put(`stay/${stay._id}`, stay)
    } else {
        savedStay = await httpService.post('stay', stay)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    const savedMsg = await httpService.post(`stay/${stayId}/msg`, { txt })
    return savedMsg
}