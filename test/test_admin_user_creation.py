import requests

admin1 = {
    "name" : "admin",
    "email" : "admin@home.com",
    "pass" : "admin",
    "privilege" : "admin"
    }

    
user1 =  {
    "name" : "Rahul",
    "email" : "rahul@home.com",
    "pass" : "rahul",
    "privilege" : "user"
    }

 
user2 =  {
    "name" : "Karan",
    "email" : "Karan@home.com",
    "pass" : "Karan",
    "privilege" : "user"
    }

user3 =  {
    "name" : "Amit",
    "email" : "Amit@home.com",
    "pass" : "Amit",
    "privilege" : "user"
    }

user4 =  {
    "name" : "Ritesh",
    "email" : "Ritesh@home.com",
    "pass" : "Ritesh",
    "privilege" : "user"
    }
    
update_user1 = {
    "name" : "Rahul Jain",
    "email" : "rahul@home.com"
    }


group1 = {
    "name" : "testgroup1",
    "members" : []
}



#################################################

def reset():
    resp = requests.get("http://localhost:3000/reset")

def api_create_admin(data):
    resp = requests.post("http://localhost:3000/create-admin",json=data)
    res_data = resp.json()
    user_data = res_data['new_user']
    assert (resp.status_code == 200), "Status code is not 200"
    assert user_data['name'] == data['name'] ,"name not matched"
    assert user_data['email'] == data['email'] ,"email not matched"
    assert user_data['privilege'] == data['privilege'] ,"privilege not matched"
    assert res_data['token'] is not None ,"token not available"
    data.update({'admin_id':user_data['_id']})
    return user_data

def api_login_admin(data):
    
    resp = requests.post("http://localhost:3000/login",json=login_data(data))
    res_data = resp.json()
    assert (resp.status_code == 200), "Status code is not 200"
    assert res_data['token'] is not None ,"token not available"
    data.update({'token':res_data['token']})
    return res_data

def api_create_user(token,data):

    resp = requests.post("http://localhost:3000/create",json=data,headers={"x-auth-token":token})
    res_data = resp.json()
    user_data = res_data['new_user']
    assert (resp.status_code == 200), "Status code is not 200"
    assert user_data['name'] == data['name'] ,"name not matched"
    assert user_data['email'] == data['email'] ,"email not matched"
    assert user_data['privilege'] == data['privilege'] ,"privilege not matched"
    assert res_data['token'] is not None ,"token not available"
    data.update({'user_id':user_data['_id']})
    return user_data

def api_update_user(token,data):
    resp = requests.put("http://localhost:3000/update",json=data,headers={"x-auth-token":token})
    res_data = resp.json()
    assert (resp.status_code == 200), "Status code is not 200"
    for key in data:
        assert res_data[key] == data[key] , key + "not matched"
    data.update({'user_id':res_data['_id']})
    return data

def api_create_group(token,data):
    resp = requests.post("http://localhost:3000/group/create",json=data,headers={"x-auth-token":token})
    res_data = resp.json()
    assert (resp.status_code == 200), "Status code is not 200"
    data.update({'group_id':res_data['_id']})
    return res_data

def api_update_group_members(token,data):
    resp = requests.put("http://localhost:3000/group/update-members",json=data,headers={"x-auth-token":token})
    res_data = resp.json()
    assert (resp.status_code == 200), "Status code is not 200"
    return res_data

def api_update_group_name(token,data):
    resp = requests.put("http://localhost:3000/group/update-name",json=data,headers={"x-auth-token":token})
    res_data = resp.json()
    assert (resp.status_code == 200), "Status code is not 200"
    return res_data

def api_send_message(user,group):
    token = user['token']
    data = create_message(group,user)
    resp = requests.post("http://localhost:3000/message",json=data,headers={"x-auth-token":token})
    res_data = resp.json()
    assert (resp.status_code == 200), "Status code is not 200"
    if 'messages' in user :
        user['messages'].append(res_data['_id'])
    else :
        user.update({'messages':[res_data['_id']]})
    print(user)
    return res_data

def api_get_messages(token,group_id):
    resp = requests.get("http://localhost:3000/get-message",json={'group_id':group_id},headers={"x-auth-token":token})
    res_data = resp.json()
    assert (resp.status_code == 200), "Status code is not 200"
    print(res_data)
    for message in res_data[0]['messages']:
        if user1['user_id'] in message['user']:
            assert message['message'] == 'Hi this is ' + user1['name'] , "message not matched"
            assert message['_id'] == user1['messages'][0] , "message id not matched"
            assert message['likes'][0] == user3['user_id'] , "likes not matched"
        if user2['user_id'] in message['user']:
            assert message['message'] == 'Hi this is ' + user2['name'] , "message not matched"
            assert message['_id'] == user2['messages'][0] , "message id not matched"
            assert message['likes'][0] == user1['user_id'] , "likes not matched"
        if user3['user_id'] in message['user']:
            assert message['message'] == 'Hi this is ' + user3['name'] , "message not matched"
            assert message['_id'] == user3['messages'][0] , "message id not matched"
            assert message['likes'][0] == user2['user_id'] , "likes not matched"
    return res_data

def api_like_message(token,message_id):
    resp = requests.post("http://localhost:3000/like",json={'message_id':message_id},headers={"x-auth-token":token})
    assert (resp.status_code == 200), "Status code is not 200"

def login_data(user):
    return {
    "email" : user['email'],
    "pass" : user['pass']
    }

def create_message(group,user):
    return {
    "group" : group['group_id'],
    "message" : 'Hi this is ' + user['name']
    }


def update_data(data,user):
    for key in data:
        user.update({key:data[key]})
    

############################################################



def test_update_user():
    reset()
    api_create_admin(admin1)
    api_login_admin(admin1)
    api_create_user(admin1['token'],user1)
    update_data(api_update_user(admin1['token'],update_user1),user1)


def test_send_message_and_view():

    #
    """
    1.Admin log in
    2.create 2 user [user3 , user2]
    3. user1 login 
    4. user1 creates group with user2 and user3
    5. user2 and user3 log in
    6. all users send message to group "Hi this is $name of user$"
    7. new user created by admin
    8. user1 adds user4 to group
    9. user1 updates name of group to updatedtestgroup1
    10. user4 log in
    11. user1 likes user2's message , user2 -> user3 , user3 -> user1
    12. check all messsages and likes
    """
    #
    api_login_admin(admin1)
    api_create_user(admin1['token'],user2)
    api_create_user(admin1['token'],user3)
    api_login_admin(user1)
    group1['members'].append(user2['user_id'])
    group1['members'].append(user3['user_id'])
    api_create_group(user1['token'],group1)
    api_login_admin(user2)
    api_login_admin(user3)
    api_send_message(user1,group1)
    api_send_message(user2,group1)
    api_send_message(user3,group1)
    api_create_user(admin1['token'],user4)
    group1['members'].append(user4['user_id'])
    api_update_group_members(user1['token'],group1)
    group1['name'] = 'updatedtestgroup1'
    api_update_group_name(user1['token'],group1)
    api_login_admin(user4)
    api_like_message(user1['token'],user2['messages'][0])
    api_like_message(user2['token'],user3['messages'][0])
    api_like_message(user3['token'],user1['messages'][0])
    api_get_messages(user4['token'],group1['group_id'])