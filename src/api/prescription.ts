import { ref } from 'vue'
import { getAuth } from 'firebase/auth'
import { set, ref as storageRef, onValue } from 'firebase/database'
import { database } from './firebase'

const location = storageRef(database, `/prescriptionRequests/${getAuth().currentUser?.uid}/`)

export const requestStatus = ref<'success'|'fail'|'acknowledged'|undefined>(undefined)

export const performPrescriptionRequest = () => {
    set(location, {__dummy: true})
}

onValue(location, snapshot => {
    const data = snapshot.val()
    const status  = data.status
    requestStatus.value = status;
})
