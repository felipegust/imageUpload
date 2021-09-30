
import React from 'react';
import { View, Image, Button, Platform } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const SERVER_URL = 'http://192.168.15.66:3000';

const createFormData = (photo, body = {}) => {
  const data = new FormData();

  data.append('photo', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

const App = () => {
  const [photo, setPhoto] = React.useState(null);

  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      // console.log(response);
      if (response) {
        setPhoto(response);
      }
    });
  };

  const handleUploadPhoto = () => {
    console.log("cheguei no upload")
    fetch(`${SERVER_URL}/api/upload`, {
      method: 'POST',
      body: createFormData(photo, { userId: '123' }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('response', response);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  const handleLaunchCamera = () => {
    launchCamera({
      storageOptions: {
        mediatype: "photo",
        saveToPhotos: true
      }
    }, response => {
      if (response) {
        console.log(response)
        setPhoto(response)
      }
    })
  }

  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {photo && (
        <>
          <Image
            source={{ uri: photo.uri }}
            style={{ width: 300, height: 300 }}
          />
          <Button title="Upload Photo" onPress={handleUploadPhoto} />
        </>
      )}
      <Button title="Launch Camera" onPress={handleLaunchCamera} />
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
    </View>
  );
};

export default App;