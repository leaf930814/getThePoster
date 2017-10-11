import 'babel-polyfill';
import fs from 'fs';
import path from 'path';
import request from 'request';

//读取文件
let readFiles = function(){
	return new Promise((resolve, reject)=>{
		fs.readdir(__dirname + '/movies', (err, files)=>{
			resolve(files);
		});
	});
}

//获取海报
let getPoster = function(movieName){
	let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`;

	return new Promise((resolve, reject)=>{
		request({url:url, json:true},function(error, response, next){

			if(error){
				return reject(error);
			}
			//console.dir(next);
			resolve(next.subjects[0].images.large);
		})
	});
}

//保存海报到本地
let savePoster = function (movieName, url) {
    request.get(url).pipe(fs.createWriteStream(path.join(__dirname,'poster', movieName + '.png')));
};

(async()=>{

	//文件列表
	let files = await readFiles();

	for(var file of files){

		let name = path.parse(file).name;

		console.log(`is getting the poster of【${name}】`);
	    savePoster(name, await getPoster(name));
	}

	console.log('done');
})()