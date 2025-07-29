import io from 'socket.io-client'
import { userService } from './user'

export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'

export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_REMOVED = 'review-removed'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

export const SOCKET_EVENT_ORDER_ADDED = 'order-added'
export const SOCKET_EMIT_ORDER_SEND = 'order-send'

export const SOCKET_EVENT_ORDER_UPDATED = 'order-updated'
export const SOCKET_EMIT_ORDER_UPDATE = 'order-update'

const baseUrl = process.env.NODE_ENV === 'production' ? '' : '//localhost:3030'
export const socketService = createSocketService()

window.socketService = socketService;

socketService.setup()

function createSocketService() {
    let socket = null
    const socketService = {
        setup() {
            socket = io(baseUrl)
            socket.on('connect', () => {
                console.log('Socket connected')
                const user = userService.getLoggedinUser()
                if (user) {
                    console.log('Logging in socket with userId:', user._id)
                    this.login(user._id)
                }
            });
            socket.on('disconnect', () => {
                console.log('Socket disconnected')
            })
        },
        on(eventName, cb) {
            socket?.on(eventName, cb)
        },
        off(eventName, cb = null) {
            if (!socket) return
            if (!cb) socket.removeAllListeners(eventName)
            else socket.off(eventName, cb)
        },
        emit(eventName, data) {
            socket?.emit(eventName, data)
        },
        login(userId) {
            socket?.emit(SOCKET_EMIT_LOGIN, userId)
        },
        logout() {
            socket?.emit(SOCKET_EMIT_LOGOUT)
        },
        terminate() {
            socket = null
        },
    };
    return socketService
}

function createDummySocketService() {
    const listenersMap = {}
    const socketService = {
        listenersMap,
        setup() {
            listenersMap = {}
        },
        terminate() {
            this.setup()
        },
        login() {
            console.log('Dummy socket service here, login - got it')
        },
        logout() {
            console.log('Dummy socket service here, logout - got it')
        },
        on(eventName, cb) {
            listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
        },
        off(eventName, cb) {
            if (!listenersMap[eventName]) return
            if (!cb) delete listenersMap[eventName]
            else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb)
        },
        emit(eventName, data) {
            let listeners = listenersMap[eventName]
            if (eventName === SOCKET_EMIT_SEND_MSG) {
                listeners = listenersMap[SOCKET_EVENT_ADD_MSG]
            }
            if (!listeners) return;
            listeners.forEach(listener => {
                listener(data);
            });
        },
        testChatMsg() {
            this.emit(SOCKET_EVENT_ADD_MSG, { from: 'Someone', txt: 'Aha it worked!' })
        },
        testUserUpdate() {
            this.emit(SOCKET_EVENT_USER_UPDATED, { ...userService.getLoggedinUser(), score: 555 })
        },
    }
    window.listenersMap = listenersMap
    return socketService
}