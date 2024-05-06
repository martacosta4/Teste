import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useNavigation } from '@react-navigation/native';
import {
    StyledLista,
    ListLogo,
    ListText,
    StyledImg,
    InnerContainer

} from './../components/styles'

const ImageList = () => {
  const [images, setImages] = useState([]);
  const nav = useNavigation()

  useEffect(() => {
    const listAllImages = async () => {
      const storage = getStorage();
      const rootRef = ref(storage);
      
  
      try {
        const listResult = await listAll(rootRef);
        const promises = listResult.prefixes.map(async (folderRef) => {
          const folderPath = folderRef.fullPath;
          const imagesInFolder = await listImagesInFolder(folderPath);
          return imagesInFolder;
        });
        const imagesInAllFolders = await Promise.all(promises);
        const allImages = imagesInAllFolders.flat();
        setImages(allImages);
      } catch (error) {
        console.error('Erro ao listar todas as imagens:', error);
      }
    };

    listAllImages();
  }, []);

  const listImagesInFolder = async (folderPath) => {
    const storage = getStorage();
    const folderRef = ref(storage, folderPath);
  
    try {
      const listResult = await listAll(folderRef);
      const promises = listResult.items.map(async (itemRef) => {
        const imageUrl = await getDownloadURL(itemRef);
        return {
          name: itemRef.name, // Nome do arquivo
          fullPath: itemRef.fullPath, // Caminho completo do arquivo
          imageUrl: imageUrl, // URL da imagem
          folder: folderPath // Nome da pasta
        };
      });
      const images = await Promise.all(promises);
      return images;
    } catch (error) {
      console.error('Erro ao listar imagens na pasta:', error);
      return [];
    }
  };
  const sortedImages = images.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  const handleCardSelect = (image) => {
    if (image.folder === 'Banco' || image.folder === 'Identificação') {
      nav.replace("CartaoId", { name: image.name.split('.')[0], img: image.imageUrl, cat: image.folder });
    } else {
      nav.replace("BarcodeScanner", { name: image.name.split('.')[0], img: image.imageUrl, cat: image.folder });
    }
  };

  return (
    <InnerContainer >
      {sortedImages.map((image, index) => (
        <StyledLista key={index} onPress={() => handleCardSelect(image)}>
          <ListLogo src={image.imageUrl} alt={image.name} />
          <ListText>{image.name.split('.')[0]}</ListText>

        </StyledLista>
      ))}
    </InnerContainer>
  );
};

export default ImageList;
