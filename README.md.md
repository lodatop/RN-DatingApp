# AceMate: Dating App

## Table of contents

 - General info
 - Technologies
 - Matching Algorithm

## General info
A react native dating app for mobile devices, developed using react native.

## Technologies
Project is created with:
 - Firebase
 - Firestore
 - React Native


## Matching Algorithm

    const [datingProfiles, setDatingProfiles] = useState([])
    
    const  getProfiles = () => {
	    setDatingProfiles([])
	    let  uid = profile.uid;
	    const  db = firebase.firestore;
	    const  query =
	    (profile.lookingFor)?
		    db.collection('profile').where('gender', 'in', profile.lookingFor)
		    : db.collection('profile').where('lookingFor', 'array-contains', profile.gender);
		    query.get()
		    .then(function(querySnapshot) {
			    querySnapshot.forEach(async  function(doc) {
				    let  user = doc.data()
					    if(user.likedBy && user.dislikedBy){
						    if(!user.likedBy.includes(uid) && !user.dislikedBy.includes(uid))
							    setDatingProfiles(oldArray  => [...oldArray, user]);
						} else  if (user.likedBy) {
							if(!user.likedBy.includes(uid))
								setDatingProfiles(oldArray  => [...oldArray, user]);
						} else  if (user.dislikedBy) {
							if(!user.dislikedBy.includes(uid))
								setDatingProfiles(oldArray  => [...oldArray, user]);
						} else {
							setDatingProfiles(oldArray  => [...oldArray, user]);
						}
					});
			})
	}

**Description**
The getProfiles function queries the profile collection, which is stored using the tool FireStore in FireBase. 
There are some relevant fields in the profile collection that help understand the logic of this algorithm, these are:

 - lookingFor: an array of the genders (stored in strings) that the user is interested in.
 - uid: the id of the user.
 - gender: the gender of the user.
 -  likedBy: an array of the uid's of users that have liked this particular user.
 - dislikedBy: an array of the uid's of users that have disliked this particular user.

So this method queries the users which gender matches with what the logged user is looking for, tha is if the lookingFor array exists, if not it queries the profiles in which the lookingFor array contains the logged in user gender.

Following that, the function filters the profiles that have already been liked or disliked by the signed in user so that they don't show up again. And then the profiles are added to usedState variable, datingProfiles which is an array of objects, the objects are the profiles that will be shown to the user.

## Team Members

 - Paolo Lodato
 - Wisam Mozalbat
