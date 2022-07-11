import 'setimmediate'
import cloudinary from 'cloudinary';
import axios from "axios";
import uploadImage from "@/modules/daybook/helpers/uploadImage";

cloudinary.config({
  cloud_name: 'jesusmrtztorres-company',
  api_key: '183122891232819',
  api_secret: 'QOO2h1ZbNfPVdkaCST1VXQGOvtM'
});

describe('Pruebas en el UploadImage', () => {
  it('Debe de cargar un archivo y retornar el url', async(done) => {
    const { data } = await axios.get('https://res.cloudinary.com/jesusmrtztorres-company/image/upload/v1656946585/hppi7mygtj44bld7ezg7.jpg', {
        responseType: 'arraybuffer'
    });

    const file = new File([data], 'foto.jpg');

    const url = await uploadImage(file);

    expect(typeof url).toBe('string');

    // tomar el ID
    const segments = url.split('/');
    const imageId = segments[segments.length - 1].replace('.jpg', '');

    cloudinary.v2.api.delete_resources(imageId, {}, () => {
        done()
    });
});
})