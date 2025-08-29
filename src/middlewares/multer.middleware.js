import multer from "multer"; // this here we will use as the middle ware to take the files and store it into the pub/temp till it gets uploaded to the cloudnary

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})


export const upload = multer({
    storage
})