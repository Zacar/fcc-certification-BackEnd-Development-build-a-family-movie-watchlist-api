import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getWatchlist,addMovie , updateMovie,deleteMovie} from '../utils/db.js';
import { authorizeModification } from '../middleware/authorize.js';


const router = express.Router();


router.use(authenticate);


router.get('/:userId',(req,res)=>{
    const {userId} = req.params;

    const watchlist = getWatchlist(Number(userId));

    return res.status(200).json(watchlist);
})

router.post('/:userId/movies', authorizeModification, (req,res)=>{
    const {userId} = req.params;
    const movie = addMovie(Number(userId),req.body);

    if(!movie){
        return res.status(400).json({
            error: 'User not found.'
        });
    }
    return res.status(201).json(movie);

})

router.put('/:userId/movies/:movieId', authorizeModification,(req,res)=>{
    const {userId,movieId} = req.params;

    const updatedMovie = updateMovie(
        Number(userId),
        Number(movieId),
        req.body
    );

    if(!updatedMovie){
        return res.status(404).json({
            error:'Movie not found.'
        });
    }
    return res.status(200).json(updatedMovie);


})


router.delete('/:userId/movies/:movieId', authorizeModification,(req,res)=>{
    const {userId,movieId}= req.params;

    const deleted = deleteMovie(
        Number(userId),
        Number(movieId)
);

if(!deleted){
    return res.status(404).json({
        error: 'Moive not found.'
    });
}
return res.status(200).json({
    message:'Movie deleted successfully.'
})
})



export default router;