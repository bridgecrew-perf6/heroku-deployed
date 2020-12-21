from flask import Flask,jsonify,request
from flask_cors import CORS
import cloudinary as Cloudinary
import cloudinary.uploader as CloudUploader

app = Flask(__name__)
CORS(app)

Cloudinary.config(
  cloud_name='botnoi',
  api_key= '814196422394631',
  api_secret='c17NWKiq45WvQpgH38C96UUhNeg'
)

@app.route('/',methods=['GET','POST'])
def home():
  return jsonify({
    'response':
      {
      'name' : ['poom','nice','dom'],
      'age' : [23,20,54]
      },
    'error':200
  })
  # request.args.get('users')
  # return "OK"

@app.route('/got',methods=['GET','POST'])
def got():
  tryit = request.form.get('blobUrl')
  # tryit = request.form['username']
  print("Data :",tryit)
  return jsonify({"status": "ok"})

@app.route('/media',methods=['GET','POST'])
def media():
  # media = request.form.get('blobfile')
  media = request.files['blobfile']
  print("Data :",media)
  result = CloudUploader.upload(media, resource_type = "video" ,public_id="v1")
  media_url = result["secure_url"]
  print("url:",media_url)
  return jsonify({"status": "ok"})


if __name__ == "__main__":
  app.run(debug=True)
