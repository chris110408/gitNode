/**
 * Created by leichen on 15/11/2.
 */
var http=require('http'),
    fs=require('fs');
function handle_incoming_request(req,res){
    console.log("incoming "+req.method + " "+req.url);
    console.log(req.url.substr(0,7));
    console.log(req.url.substr(req.url.length-5));
    if(req.url=='/ablums.json'){
        handle_load_albums(req,res);
    }else if(req.url.substr(0,7)=='/ablums' &&req.url.substr(req.url.length-5)=='.json'){
        handle_get_albums(req,res);
    }else{
        res.writeHead(404, {"Content-Type": "applicaton/json"});
        res.end(JSON.stringify({error: "unknown_res"}) + "\n");

    }


    function handle_load_albums(req,res) {
        load_albums_list(function (err, alblums) {
            if (err != null) {

                res.writeHead(503, {"Content-Type": "applicaton/json"});
                res.end(JSON.stringify({error: "file_error", message: err.message}) + "\n");
            }

            res.writeHead(200, {"Content-Type": "applicaton/json"});
            res.end(JSON.stringify({error: null, data: {alblums: alblums}}) + "\n");

        })
    }

    function handle_get_albums(req,res) {
        var album_name=req.url.substr(7,req.url.length-12)
        load_albums(album_name,function (err, photo) {
            if (err != null) {

                res.writeHead(503, {"Content-Type": "applicaton/json"});
                res.end(JSON.stringify({error: "file_error", message: err.message}) + "\n");
            }

            res.writeHead(200, {"Content-Type": "applicaton/json"});
            res.end(JSON.stringify({error: null, data: {album_name: album_name,photo:photo}}) + "\n");

        })
    }


}

function load_albums_list(callback){
    fs.readdir('albums',function(err,file_list){
        if(err){
            callback(err)
            return
        }

        var dir_only=[];

        (function iterator(i){
            if(i>=file_list.length){
                callback(null,dir_only);
                return
            }
            fs.stat("albums/"+file_list[i],function(err,stat){
                if(err){
                    callback(err)
                    return;
                }
                console.log(i)
                if(stat.isDirectory()){
                    dir_only.push(file_list[i])


                }
                iterator(i+1)

            })



        })(0)

    })

}


function load_albums(album_name,callback){
    fs.readdir('albums/'+album_name,function(err,file_list){
        if(err){
            callback(err)
            return
        }

        var file_only=[];

        (function iterator(i){
            if(i>=file_list.length){
                callback(null,file_only);
                return
            }
            fs.stat("albums/"+album_name+"/"+file_list[i],function(err,stat){
                if(err){
                    callback(err)
                    return;
                }
                console.log(i)
                if(stat.isFile()){
                    file_only.push(file_list[i])


                }
                iterator(i+1)

            })



        })(0)

    })

}


var s= http.createServer(handle_incoming_request);
s.listen(8080);