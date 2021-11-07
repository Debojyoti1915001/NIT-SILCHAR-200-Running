import os
import random
import requests
import numpy as np
import pandas as pd
from tqdm import tqdm
from PIL import Image
from io import BytesIO
from flask import Flask, request, jsonify


import re
import nltk
import spacy
import pickle

import tensorflow as tf
from tensorflow.keras.utils import *
from tensorflow.keras.models import *
from tensorflow.keras.layers import *
from tensorflow.keras.applications import vgg16
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.imagenet_utils import preprocess_input

from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


dress = pd.read_csv('desc.csv')
newdata = pd.read_csv('final.csv').fillna(' ')
with open("./img.pkl", 'rb') as picklefile:
    train = pickle.load(picklefile)

vgg_model = vgg16.VGG16(weights='imagenet')
feat_extractor = Model(inputs=vgg_model.input, outputs=vgg_model.get_layer("fc2").output)

with open("./group.pkl", 'rb') as picklefile:
    group_sim = pickle.load(picklefile)
cosine_similarities = cosine_similarity(group_sim) 
similarities = {}
for i in range(len(cosine_similarities)):
    similar_indices = cosine_similarities[i].argsort()[:-6:-1] 
    similarities[dress['Description'].iloc[i]] = [(cosine_similarities[i][x], dress['Group'][x]) for x in similar_indices][1:]

def most_similar_products(test_id, n_sim = 3):
    importedImages=[]
    dataImages=[]
    org_response = requests.get(test_id)
    original = Image.open(BytesIO(org_response.content))
    original = original.resize((224, 224))
    numpy_img = img_to_array(original)
    img_batch = np.expand_dims(numpy_img, axis=0)
    importedImages.append(img_batch.astype('float16'))
    images = np.vstack(importedImages)
    processed_imgs = preprocess_input(images.copy())
    imgs_features = feat_extractor.predict(processed_imgs)
    
    cosSimilarities_serie = cosine_similarity(train, imgs_features.reshape(1,-1)).ravel()
    cos_similarities = pd.DataFrame({'sim':cosSimilarities_serie,'id':newdata[:train.shape[0]].index},
                                    index=newdata['Image URL'][:train.shape[0]]).sort_values('sim',ascending=False)[0:n_sim+1]

    #plot n most similar
    for i in range(0,n_sim):
        dataImages.append(newdata['Image URL'][cos_similarities.id[i]])

    return dataImages

app = Flask(__name__)
@app.route('/product', methods=['POST'])
def json_example():
    request_data = request.get_json()
    url = request_data['url']
    return str(most_similar_products(url,2))

@app.route('/group', methods=['POST'])
def des_example():
    request_data = request.get_json()
    desc = request_data['des']
    return  jsonify(group=similarities[desc][0][1],
                   sim=similarities[desc][0][0])

if __name__ == '__main__':
    app.run(debug=True, port=5000)