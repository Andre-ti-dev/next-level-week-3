import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from "react-router-dom";
import { FiPlus, FiX } from 'react-icons/fi';

import api from "../services/api";

import Sidebar from "../components/Sidebar";

import mapIcon from "../utils/mapIcon";

import '../styles/pages/create-orphanage.css';

export default function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({latitude: 0, longitude: 0})

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    setPosition({
      latitude: lat,
      longitude: lng
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    const selectedImages = Array.from(event.target.files);
    setImages([...images, ...selectedImages]);
    
    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });
    setPreviewImages([...previewImages, ...selectedImagesPreview]);
  }

  function handleRemoveImage (imageIndex: number) {
    setImages(images.filter(image => images.indexOf(image) !== imageIndex));
    setPreviewImages(previewImages.filter(previewImage => previewImages.indexOf(previewImage) !== imageIndex));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    
    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso');

    history.push('/app');
    
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-24.0341505, -46.5258994]}
              zoom={15}
              style={{ width: '100%', height: 280 }}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude !== 0 && (
                <Marker 
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]} 
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image, index) => {
                  return (
                    <figure key={image}>
                      <button type="button" onClick={() => handleRemoveImage(index)}>
                        <FiX size={22} color="#FF669D" />
                      </button>
                      <img src={image} alt={`${name} imagem`} />
                    </figure>
                  )
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                <input type="file" multiple onChange={handleSelectImages} id="image[]"/>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block open-on-weekends">
              <label htmlFor="open_on_weekends">Atende fim de semana?</label>
              <button
                type="button"
                id="open_on_weekends"
                className={`toggler-container${open_on_weekends ? ' on' : ''}`}
                onClick={() => setOpenOnWeekends(!open_on_weekends)}
              >
                <span className="toggler"></span>
              </button>
            </div>
          </fieldset>

          <button className="confirm-button primary-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}