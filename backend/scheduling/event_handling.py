
from flask import Flask, request, jsonify, Response
from flask_cors import CORS, cross_origin
import pymongo
import json
import os
import time
from bson.objectid import ObjectId
import re
import requests

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

DB_USERNAME = os.getenv('DB_USERNAME')
DB_PWD = os.getenv('DB_PWD')
# URL = "mongodb+srv://rhdevs-db-admin:{}@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority".format(DB_PWD)

# client = pymongo.MongoClient(URL)
client = pymongo.MongoClient(
    "mongodb+srv://rhdevs-db-admin:rhdevs-admin@cluster0.0urzo.mongodb.net/RHApp?retryWrites=true&w=majority")
db = client["RHApp"]


@app.route("/")
@cross_origin()
def hello():
    return "Welcome the Raffles Hall Events server"


@app.route("/timetable/<userID>")
@cross_origin()
def getUserTimetable(userID):
    try:
        data = db.Lessons.find({"userID": userID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/all')
@cross_origin()
def getAllEvents():
    try:
        data = db.Events.find()
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event/private/all')
@cross_origin()
def getAllPrivateEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": True}})
        response = []
        for item in data:
            item['eventID'] = item.pop('_id')
            response.append(item)
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route('/event/public/all')
@cross_origin()
def getAllPublicEvents():
    try:
        data = db.Events.find({"isPrivate": {"$eq": False}})
        response = []
        for item in data:
            item['eventID'] = item.pop('_id')
            response.append(item)
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route('/event/afterTime/<startTime>')
@cross_origin()
def getEventAfterTime(startTime):
    try:
        data = db.Events.find({"startDateTime": {"$gt": int(startTime)}})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/cca/all')
@cross_origin()
def getAllCCA():
    try:
        data = db.CCA.find()
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/event')
@cross_origin()
def getEventsDetails():
    try:
        data = request.get_json()
        body = []

        for eventID in data:

            result = db.Events.find_one({"_id": ObjectId(eventID)})
            result['eventID'] = result.pop('_id')
            body.append(result)
            print(result)

    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(body), default=lambda o: str(o)), 200


@app.route('/event/<int:ccaID>')
@cross_origin()
def getEventsCCA(ccaID):
    try:
        data = db.Events.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route('/cca/<int:ccaID>')
@cross_origin()
def getCCADetails(ccaID):
    try:
        data = db.CCA.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA/<userID>")
@cross_origin()
def getUserCCAs(userID):
    try:
        data = db.UserCCA.find({"userID": userID})
        response = []
        for entry in data:
            ccaID = entry["ccaID"]
            response.append(db.CCA.find_one({"ccaID": ccaID}))

    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(response, default=lambda o: str(o)), 200


@app.route("/user_event/<userID>/<int:referenceTime>")
@cross_origin()
def getUserAttendance(userID, referenceTime):
    try:
        data = list(db.Attendance.find({"userID": userID}))
        startOfWeek = referenceTime - ((referenceTime - 345600) % 604800)
        endOfWeek = startOfWeek + 604800
        response = []

        for entry in data:
            eventID = entry.get('eventID')
            result = db.Events.find_one({"_id": ObjectId(eventID)})
            startTime = result['startDateTime']

            if startTime < endOfWeek and startTime >= startOfWeek:
                result['eventID'] = result.pop('_id')
                response.append(result)

    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(response), default=lambda o: str(o)), 200


@app.route("/user_event/<eventID>")
@cross_origin()
def getEventAttendees(eventID):
    try:
        data = db.Attendance.find({"eventID": eventID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA/<int:ccaID>")
@cross_origin()
def getCCAMembers(ccaID):
    try:
        data = db.UserCCA.find({"ccaID": ccaID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA")
@cross_origin()
def getCCAMembersName():
    try:
        ccaName = str(request.args.get('ccaName'))
        print(ccaName)
        data = db.UserCCA.find({"ccaName": ccaName})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/user_CCA/add", methods=['POST'])
@cross_origin()
def addUserCCA():
    try:
        data = request.get_json()
        userID = data.get('userID')
        ccaID = int(data.get('ccaID'))
        ccaName = data.get('ccaName')

        body = {
            "userID": userID,
            "ccaID": ccaID,
            "ccaName": ccaName,
        }
        db.UserCCA.insert_one(body)

        return {"message": "Successful"}, 200

    except Exception as e:
        return {"err": str(e)}, 400


@app.route("/permissions/<userID>")
@cross_origin()
def getUserPermissions(userID):
    try:
        data = db.UserPermissions.find({"recipient": userID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/permissions", methods=['DELETE', 'POST'])
@cross_origin()
def addDeletePermissions():
    try:
        userID1 = str(request.args.get('userID1'))
        userID2 = str(request.args.get('userID2'))
        if request.method == "POST":
            body = {
                "donor": userID1,
                "recipient": userID2
            }
            db.UserPermissions.insert_one(body)

        elif request.method == "DELETE":
            db.UserPermissions.delete_one({
                "donor": userID1,
                "recipient": userID2
            })
            return Response(status=200)

    except Exception as e:
        return {"err": str(e)}, 400
    return {"message": "Action successful"}, 200


@app.route("/event/add", methods=['POST'])
@cross_origin()
def createEvent():
    try:
        data = request.get_json()
        eventName = str(data.get('eventName'))
        startDateTime = int(data.get('startDateTime'))
        endDateTime = int(data.get('endDateTime'))
        description = str(data.get('description'))
        location = data.get('location')
        ccaID = int(data.get('ccaID'))
        userID = data.get('userID')
        image = data.get('image')
        isPrivate = data.get('isPrivate')

        body = {
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image,
            "isPrivate": isPrivate
        }

        receipt = db.Events.insert_one(body)
        body["eventID"] = str(receipt.inserted_id)

        return {"message": body}, 200

    except Exception as e:
        return {"err": str(e)}, 400


@app.route("/event/delete/<eventID>", methods=['DELETE'])
@cross_origin()
def deleteEvent(eventID):
    try:
        db.Events.delete_one({"_id": eventID})

    except Exception as e:
        return {"err": str(e)}, 400
    return {"message": "successful"}, 200


@app.route("/event/edit", methods=['PUT'])
@cross_origin()
def editEvent():
    try:
        data = request.get_json()
        eventID = data.get('eventID')
        eventName = str(data.get('eventName'))
        startDateTime = int(data.get('startDateTime'))
        endDateTime = int(data.get('endDateTime'))
        description = str(data.get('description'))
        location = data.get('location')
        ccaID = int(data.get('ccaID'))
        userID = data.get('userID')
        image = data.get('image')
        isPrivate = data.get('isPrivate')

        body = {
            "eventName": eventName,
            "startDateTime": startDateTime,
            "endDateTime": endDateTime,
            "description": description,
            "location": location,
            "ccaID": ccaID,
            "userID": userID,
            "image": image,
            "isPrivate": isPrivate
        }

        result = db.Events.update_one(
            {"_id": ObjectId(eventID)}, {'$set': body})
        if int(result.matched_count) > 0:
            return {'message': "Event changed"}, 200
        else:
            receipt = db.Events.insert_one(body)
            body["eventID"] = str(receipt.inserted_id)

            return {"message": body}, 200

    except Exception as e:
        return {"err": str(e)}, 400
    return {'message': "Event changed"}, 200


@app.route("/user_event", methods=['POST', 'DELETE'])
@cross_origin()
def editAttendance():
    try:
        data = request.get_json()
        eventID = data.get('eventID')
        userID = data.get('userID')
        body = {
            "userID": userID,
            "eventID": eventID
        }
        if request.method == "POST":
            db.Attendance.insert_one(body)

        elif request.method == "DELETE":
            db.Attendance.delete_many(body)

    except Exception as e:
        return {"err": str(e)}, 400
    return {'message': "Attendance edited"}, 200


@app.route("/nusmods/<userID>")
@cross_origin()
def getMods(userID):
    try:
        data = db.NUSMods.find({"userID": userID})
    except Exception as e:
        return {"err": str(e)}, 400
    return json.dumps(list(data), default=lambda o: str(o)), 200


@app.route("/nusmods/delete/<userID>", methods=['DELETE'])
@cross_origin()
def deleteMods(userID):
    try:
        db.NUSMods.delete_one({"userID": userID})

    except Exception as e:
        return {"err": str(e)}, 400
    return {"message": "successful"}, 200


@app.route("/nusmods", methods=['PUT'])
@cross_origin()
def addMods():
    try:
        data = request.get_json()
        userID = data.get('userID')
        mods = data.get('mods')

        body = {
            "userID": userID,
            "mods": mods,
        }

        result = db.NUSMods.update_one({"userID": userID}, {'$set': body})
        if int(result.matched_count) > 0:
            return {'message': "Changed"}, 200
        else:
            db.NUSMods.insert_one(body)
            return {'message': "successful"}, 200

    except Exception as e:

        return {"err": str(e)}, 400
    return {"message": "successful"}, 200

@app.route("/nusmods/addNUSMods", methods=['PUT'])
@cross_origin()
def addNUSModsEvents():

    ABBREV_TO_LESSON = {
        "DLEC": 'Design Lecture',
        "LAB": 'Laboratory',
        "LEC": 'Lecture',
        "PLEC": 'Packaged Lecture',
        "PTUT": 'Packaged Tutorial',
        "REC": 'Recitation',
        "SEC": 'Sectional Teaching',
        "SEM": 'Seminar-Style Module Class',
        "TUT": 'Tutorial',
        "TUT2": 'Tutorial Type 2',
        "TUT3": 'Tutorial Type 3',
        "WS": 'Workshop',
    }

    def extractDataFromLink(nusModURL):
        k = re.findall(r"(\w+)=(.*?(?=\&|$))", nusModURL)
        out = []
        for value in k:
            out.append([(value)[0], value[1].split(",")] )
        return out

    

    def fetchDataFromNusMods(academicYear, currentSemester, moduleArray):
        NUSModsApiURL = "https://api.nusmods.com/v2/{year}/modules/{moduleCode}.json".format(year=academicYear, moduleCode=moduleArray[0])
        moduleData =requests.get(NUSModsApiURL).json()["semesterData"][currentSemester - 1]["timetable"]
        out = []
        for lesson in moduleArray[1]:
            if lesson == "":
                break
            abbrev, classNo = lesson.split(":")
            lessonType = ABBREV_TO_LESSON[abbrev]
            lesson = list(filter(lambda moduleClass: moduleClass["classNo"] == classNo and moduleClass["lessonType"]  == lessonType, moduleData))[0]
            lesson["abbrev"] = abbrev
            out.append(lesson)

        out = list(map(lambda classInformation: {"eventName": moduleArray[0] + " " + classInformation["abbrev"], 
                                                 "location": classInformation["venue"],
                                                 "day": classInformation["day"],
                                                 "endTime":classInformation["endTime"],
                                                 "startTime": classInformation["startTime"],
                                                 "hasOverlap": False,
                                                 "eventType": "mods",
                                                 "weeks": classInformation["weeks"]}
                    , out))
        return out
            

    try:
        data = request.get_json()
        url = data.get('url')
        userID = data.get('userID')
        academicYear = data.get('academicYear')
        currentSemester = data.get('currentSemester')


        oneModuleArray = extractDataFromLink(url)

        output=list(map(lambda module: fetchDataFromNusMods(academicYear, currentSemester, module), oneModuleArray))
        output = [item for sublist in output for item in sublist]

        body = {"userID": userID,
                "mods": output}

        db.NUSMods.update_one({"userID": userID}, {"$set": body}, upsert=True)

        return json.dumps(db.NUSMods.find_one({"userID": userID}), default=lambda o: str(o)), 200

    except Exception as e:

        return {"err": str(e)}, 400



if __name__ == "__main__":
    app.run(threaded=True, debug=True)
    # app.run('0.0.0.0', port=8080)
