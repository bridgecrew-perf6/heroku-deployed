from flask import Flask,jsonify,request, redirect, url_for
from flask_cors import CORS
import cloudinary as Cloudinary
import cloudinary.uploader as CloudUploader
from mongo import MongoConnector
from datetime import datetime

app = Flask(__name__)
CORS(app)

# connecting to mongoDB #
db = MongoConnector.connect()

# cloudinary api config#
Cloudinary.config(
  cloud_name='botnoi',
  api_key= '814196422394631',
  api_secret='c17NWKiq45WvQpgH38C96UUhNeg'
)

@app.route('/',methods=['GET','POST'])
def home():
  # request form #
  media = request.files['blobfile']
  blobtitle = request.form.get('blobtitle')

  # var name file #
  title = "{}".format(blobtitle)

  # upload to cloudinary #
  result = CloudUploader.upload(media, resource_type = "video" ,public_id="audio/{}".format(title))

  # generate url link #
  media_url = result["secure_url"]

  # config insert_temp #
  insert_temp = {
    "date" : datetime.now().isoformat(),
    "file" : media_url
  }

  # insert data to database #
  db.sound_files.insert_one(insert_temp)

  return jsonify({
    "status": "บันทึกสำเร็จ",
    "url":"{}".format(media_url)
    })


if __name__ == "__main__":
  app.run(debug=True,port=8080)

