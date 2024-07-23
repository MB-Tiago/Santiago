import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const DisplayImage = ({ publicId }) => {
    const cld = new Cloudinary({ cloud: { cloudName: 'dnw3vru0m' } });

    const img = cld.image(publicId)
        .format('auto') 
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

    return <AdvancedImage cldImg={img} />;
};

export default DisplayImage;
