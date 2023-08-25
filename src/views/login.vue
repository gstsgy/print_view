<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">打印机客户端</div>
      <el-form :model="param" :rules="rules" ref="loginForm" label-width="0px" class="ms-content" >
        <el-form-item prop="code">
          <el-input v-model="param.code" placeholder="用户名">
            <template #prepend>
              <el-button icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="passwd">
          <el-input
              type="password"
              placeholder="密码"
              v-model="param.passwd"

              show-password
          >
            <template #prepend>
              <el-button icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(loginForm)">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码区分大小写。</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useTagsStore} from '../store/tags';
import {ElMessage,FormRules, FormInstance} from 'element-plus';
import {getData, saveData, saveDataS} from '../utils/storageUtils'
import request from "../utils/request";
import {router, homeRoutes,defaultHomeRoutes} from '../router'
import {MenuModel} from '../api/interface'
const param = ref({
  code: getData("user.code"),
  passwd: getData("user.passwd")
});

const rules: FormRules = {
  code: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  passwd: [{required: true, message: '请输入密码', trigger: 'blur'}]
};
const loginForm = ref<FormInstance>()
const submitForm = (loginForm:FormInstance|undefined) => {
  if(!loginForm)return
  loginForm.validate((valid: boolean) => {
    if (valid) {
      request.post("auth/login", param.value).then(res => {
        // @ts-ignore
        if (res.code === 200) {
          saveData("user.code", param.value.code);
          saveData("user.passwd", param.value.passwd);
          saveDataS("token", res.data);

          ElMessage.success('登录成功');
          // 权限
          request.get("auth/menus", {
            params: {
              type: 1
            }
          }).then(res => {
            resolveMenu(res.data)
            router.push('/');
          })


        }
      })
    } else {
      ElMessage.error('登录失败');
      return false;
    }
  });
};
const modules = import.meta.glob('@/views/*/*.vue')
const resolveMenu = (menus: any) => {

  const menu = [] as MenuModel[]
  homeRoutes.children = []
  // @ts-ignore
  homeRoutes.children.push(...defaultHomeRoutes)
  for (const model of menus) {
    const tmp:MenuModel = {
      icon: model.menuView,
      index: model.menuId + "",
      title: model.menuLabel,
      subs: [] as MenuModel[]
    }
    for (const page of model.children) {
      tmp.subs!.push({
        index: page.menuAction,
        title: page.menuLabel
      })
      //console.log(page.menuAction)
      const str= modules['/src/views'+page.menuAction+".vue"]
      if(str){
        homeRoutes.children.push({
          path: page.menuAction,
          name: page.menuAction,
          meta: {
            title: page.menuLabel
          },
          // @ts-ignore
          component: str,

        } as never)
      }

    }
    menu.push(tmp)
  }
  saveDataS("menu", JSON.stringify(menu))
  saveDataS("route",JSON.stringify(homeRoutes))
  // 解析路由
  //return menu;
  router.addRoute(homeRoutes)
}

const tags = useTagsStore();
tags.clearTags();

if(router.hasRoute("Home")){
  router.removeRoute("Home")
}
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
