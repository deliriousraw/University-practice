import firebase from 'firebase/app'

export default function (to, from, next) {
  if (!firebase.auth().currentUser) {
    next('/login?loginError=true')
  } else {
    next()
  }
}
