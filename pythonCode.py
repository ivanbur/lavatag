from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
@app.route("/index")
def index():
  return render_template("index.html")

# @app.route("/favicon.ico")
# def favicon():
# 	return send_from_directory(os.path.join(app.root_path, "static", "images"), "favicon.ico", mimetype="image/png")
  
  
  
if __name__ == "__main__":
  app.run()