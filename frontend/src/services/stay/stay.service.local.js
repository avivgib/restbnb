
import { storageService } from '../async-storage.service.js'
import { makeId } from '../util.service.js'
import { userService } from '../user/index.js'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}
window.cs = stayService


async function query(filterBy = {}) {
    try {
        let stays = await storageService.query(STORAGE_KEY)
        const { location, checkIn, checkOut, guests } = filterBy

        if (location) {
            const regex = new RegExp(location, 'i')
            stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.loc?.address))
        }

        // if (checkIn && checkOut) {
        //     stays = stays.filter(stay => {
        //         // needs add a logic
        //         return true
        //     })
        // }

        if (guests && guests.adults > 0) {
            const totalGuests = guests.adults + guests.children
            stays = stays.filter(stay => stay.capacity >= totalGuests)
        }

        return stays
    } catch (err) {
        console.error('Error fetching stays:', err)
        throw err
    }
    // var stays = await storageService.query(STORAGE_KEY)
    // const { txt, minSpeed, maxPrice, sortField, sortDir } = filterBy

    // if (txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     stays = stays.filter(stay => regex.test(stay.vendor) || regex.test(stay.description))
    // }
    // if (minSpeed) {
    //     stays = stays.filter(stay => stay.speed <= minSpeed)
    // }
    // if (maxPrice) {
    //     stays = stays.filter(stay => stay.price <= maxPrice)
    // }
    // if (sortField === 'vendor' || sortField === 'owner') {
    //     stays.sort((stay1, stay2) =>
    //         stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    // }
    // if (sortField === 'price' || sortField === 'speed') {
    //     stays.sort((stay1, stay2) =>
    //         (stay1[sortField] - stay2[sortField]) * +sortDir)
    // }

    // stays = stays.map(({ _id, vendor, price, speed, owner }) => ({ _id, vendor, price, speed, owner }))
    // return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    var savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            stay: stay.name,
            price: stay.price,
            loc: stay.loc,
            capacity: stay.capacity,
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            name: stay.name,
            price: stay.price,
            loc: stay.loc,
            capacity: stay.capacity,
            // Later, owner is set by the backend
            host: userService.getLoggedinUser(),
            msgs: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    // Later, this is all done by the backend
    const stay = await getById(stayId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    stay.msgs.push(msg)
    await storageService.put(STORAGE_KEY, stay)

    return msg
}