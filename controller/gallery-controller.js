

exports.AddGalleryImage=(req,res,next)=>{
    try{
        const {name}= req.body

    }catch(err){
        console.log(err)
        next(err)
    }
}