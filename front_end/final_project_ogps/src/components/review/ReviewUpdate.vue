<template>
  <div>
    <div class="d-flex justify-content-center animate__animated animate__backInDown">
          <h1 class="mt-2"><mark class="highlight-bottom">여행 후기 수정</mark></h1>
    </div>   
    <div class="d-flex justify-content-center mt-3 mb-3 p-4 roundlist animate__animated animate__backInLeft anidelay" style="height: 900px; background-color: rgba(255, 255, 255, 0.5);
      margin-left: 130px; margin-right: 130px; padding-top: 10px;">
      <!-- <div class="row roundlist d-flex justify-content-center mt-3 row p-4" style="width: 90%; height: 90%; background-color: rgba(255, 255, 255, 0.5);"> -->
        <!-- <h3 class="d-flex justify-content-center" style="color: gray; width: 100%;">Share My Trip</h3> -->
        <div class="row mt-5  middle-content " style="width: 85%; height: 90%;">
          <div class="roundlist" style="border-bottom: solid 3px gray; width: 100%; height: 10%; background-color: rgba(255, 255, 255, 0.5);">
            <div class="row middle-content" style="width: 100%; height: 100%;">
              <div class="col-2 middle-content mt-2">
                  <h3>제목</h3>
              </div>
              <div class="col-8">
                <input class="transparent-input" v-model="subject" placeholder="제목을 입력해주세요..." style="width: 100%;">
              </div>
            </div>
          </div>
          <div class="roundlist" style="border-bottom: solid 3px gray; width: 100%; height: 50%; background-color: rgba(255, 255, 255, 0.5);">
            <div class="row middle-content" style="width: 100%; height: 100%;">
              <div class="col-2 middle-content mt-2">
                  <h3>내용</h3>
              </div>
              <div class="col-8">
                <div class="textarea-wrapper">
                  <textarea class="transparent-textarea"
                    v-model="content"
                    id="textarea-rows"
                    placeholder="내용을 입력해주세요..."
                    rows="8"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="roundlist" style="border-bottom: solid 3px gray; width: 100%; width: 100%; height: 30%; background-color: rgba(255, 255, 255, 0.5);">
            <div class="file-input-wrapper">
              <input type="file" multiple ref="fileInput" @change="handleFileUpload" accept="image/*">
              <label for="fileInput" class="file-input-label">
                <span>이미지 선택</span>
              </label>
            </div>
            <div >
              <div v-if="images.length===0" class="row ml-4 mr-4">
                <button v-if="fileObjectUrl1" @click="getdeleteImage(0)" style="margin-right: 30px;"><img :src="fileObjectUrl1" width="100px" height="100px" alt="이미지"></button>
                <button v-if="fileObjectUrl2" @click="getdeleteImage(1)" style="margin-right: 30px;"><img :src="fileObjectUrl2" width="100px" height="100px" alt="이미지"></button>
                <button v-if="fileObjectUrl3" @click="getdeleteImage(2)" style="margin-right: 30px;"><img :src="fileObjectUrl3" width="100px" height="100px" alt="이미지"></button>
                <button v-if="fileObjectUrl4" @click="getdeleteImage(3)" style="margin-right: 30px;"><img :src="fileObjectUrl4" width="100px" height="100px" alt="이미지"></button>
                <button v-if="fileObjectUrl5" @click="getdeleteImage(4)" style="margin-right: 30px;"><img :src="fileObjectUrl5" width="100px" height="100px" alt="이미지"></button>
              </div>
              <div v-else class="row ml-4 mr-4">
                <div class="col-2" v-for="(image, index) in images" :key="image.imageUrl">
                  <button @click="deleteImage(index)" style="margin-right: 30px;">
                    <img :src="image.imageUrl" width="100px" height="100px" alt="이미지">
                  </button>
                </div>
            </div> 
            </div> 
          </div>
          <div class="d-flex justify-content-end" style="width: 100%;">
              <b-button style="width: 80px;" variant="primary" @click="uploadImage">글 수정</b-button>
              <b-button style="width: 80px; margin-left: 10px;" variant="success" @click="movelist">목록</b-button>
          </div>
        </div>
      <!-- </div> -->
    </div>
  
  </div>
</template>

<script>
import http from '@/api/http'
import axios from 'axios';
import { mapState } from "vuex";
const memberStore = "memberStore";

export default {
  name: 'ReviewUpdate',
  data() {
    return {
      articleNo: 0,
      fileObjectUrl1: '',
      fileObjectUrl2: '',
      fileObjectUrl3: '',
      fileObjectUrl4: '',
      fileObjectUrl5: '',
      imageUrl: '',
      article: {},
      images: [],
      fileInfo: [],
      subject: '',
      content: '',
      selectedFiles: [],
      deleteIdx : [],
    };
  },
  computed:{
    ...mapState(memberStore, ["userInfo"]),
  },
  created(){
    this.articleNo = this.$route.params.articleNo;
    console.log(this.articleNo);

    http.get(`/api/review/${this.articleNo}`)
      .then(response => {
        console.log(response.data);
        this.article = response.data.review;
        this.subject = this.article.subject;
        this.content = this.article.content;
      })
      .catch(error => {
        console.error(error);
      });
      
     //get file
    http.get(`/api/rfile/${this.articleNo}`)
        .then(response => {
          this.fileInfo = response.data.fileInfo;

          for (let i = 0; i < this.fileInfo.length; i++) {
            http.get(`/api/rfile/detail/${this.fileInfo[i].idx}`, {
                responseType: "blob"
            }).then(response => {
                console.log(response.data.size);
                    const blob = new Blob([response.data]);
                    if(i==0)
                    this.fileObjectUrl1 = window.URL.createObjectURL(blob);
                    if(i==1)
                    this.fileObjectUrl2 = window.URL.createObjectURL(blob);
                    if(i==2)
                    this.fileObjectUrl3 = window.URL.createObjectURL(blob);
                    if(i==3)
                    this.fileObjectUrl4 = window.URL.createObjectURL(blob);
                    if(i==4)
                    this.fileObjectUrl5 = window.URL.createObjectURL(blob);
            }) 
          }

        })
        .catch(error => {
          console.error(error);
      });
  },
  methods: {
    handleFileUpload(event) {
      const fileList = event.target.files;  // 선택된 파일 목록
      this.images = [];  // 배열로 초기화

      const remainingSlots = 5 - this.images.length;
      if (fileList.length <= remainingSlots) {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            file.imageUrl = URL.createObjectURL(file);  // 이미지 URL 추가
            this.images.push(file);  // 파일을 images 배열에 추가
            this.selectedFiles.push({
              name: file.name,  // 파일 이름
              size: file.size,  // 파일 크기 등 원하는 파일 정보 추가
              file: file  // 선택된 파일 객체
            });
          }
        } else {
          // 파일 선택 개수가 제한을 초과할 경우에 대한 처리
          alert("이미지는 5개 이하로 선택해주세요.")
        }
    },

    deleteImage(index) {
      this.images.splice(index, 1); // 이미지 삭제
    },

    getdeleteImage(i) {
      this.deleteIdx.push(this.fileInfo[i].idx);

      if(i==0)
      this.fileObjectUrl1 = '';
      if(i==1)
      this.fileObjectUrl2 = '';
      if(i==2)
      this.fileObjectUrl3 = '';
      if(i==3)
      this.fileObjectUrl4 = '';
      if(i==4)
      this.fileObjectUrl5 = '';
      
      this.fileInfo.splice(i, 1); // 이미지 삭제
    },

    movelist(){
      this.$router.push("/review");
    },

    uploadImage() {

      if (this.subject === '') {
          alert("제목을 입력해주세요..");
        } else if (this.content === '') {
          alert("내용을 입력해주세요..");
        }else{
          //게시글 수정
          http.put(`/api/review`, {
            userId: this.userInfo.userId,
            subject: this.subject,
            content: this.content,
            articleNo: this.articleNo,
        }).then(response => {
            console.log(response.data.message);

            console.log(this.deleteIdx);
          //파일 선택시
          if (this.images.length>0) {

            http.delete(`/api/rfile/all/${this.articleNo}`)
                .then(response => {
                  console.log(response.data.message);

                for (var j = 0; j < this.images.length; j++) {
                    const formData = new FormData();
                    formData.append('upfile', this.images[j]);
                    formData.append('articleNo', this.articleNo);

                    axios.post('http://localhost:9001/api/rfile', formData, {
                      header: {
                        'Content-Type': 'multipart/form-data'
                      }
                      })
                      .then(response => {
                        console.log(response.data.message);
                      })
                      .catch(error => {
                        console.error(error);
                      });
                  }


                })
                .catch(error => {
                  console.error(error);
                });

          }else{
          //기존 파일 수정

            for (let i = 0; i < this.deleteIdx.length; i++) {
              console.log(this.deleteIdx[i]);
                http.delete(`/api/rfile/${this.deleteIdx[i]}`)
                .then(response => {
                  console.log(response.data.message);
                })
                .catch(error => {
                  console.error(error);
                });
            }
          }

        }).catch(error => {
              console.error(error);
        });

        this.$router.push({name : 'review'});
      }

      
    }
  }

};
</script>

<style>
.roundlist{
  border-radius: 30px;
}

.highlight-bottom {
  background: linear-gradient(to top, rgb(207, 250, 219) 18%, transparent 40%);
  color: rgb(218, 247, 223);
}

.middle-content{
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.transparent-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.textarea-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.transparent-textarea {
background-color: transparent;
border: none;
outline: none;
resize: none;
width: 100%;
height: 100%;
padding: 0;
font-family: inherit;
font-size: inherit;
color: inherit;
}

.transparent-textarea::placeholder {
position: absolute;
top: 50%;
left: 0;
transform: translate(0, -50%);
width: 100%;
color: gray;
}

.file-input-wrapper {
position: relative;
display: inline-block;
}

input[type="file"] {
opacity: 0;
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
cursor: pointer;
}

.file-input-label {
display: inline-block;
background-color: #f9f9f9;
border: 1px solid #ccc;
padding: 8px 16px;
border-radius: 4px;
cursor: pointer;
}

.file-input-label span {
display: block;
}

.selected-files {
font-size: 12px;
color: #777;
margin-top: 4px;
}
.anidelay{
    animation-delay: 0.5s;
}
</style>