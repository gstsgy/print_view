import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router';
import Home from '@/views/home.vue';
import Login from '@/views/login.vue';
import User from '@/views/permission/self.vue';
import {getDataS} from "../utils/storageUtils";

const defaultRoutes = [
    {
        component: Login,
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        }
    },
    {
        path: '/',
        redirect: '/dashboard',
    }
]
const defaultHomeRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard',
        meta: {
            title: '系统首页'
        },
        component: () => import("@/views/dashboard.vue")
    },
    {
        path: '/permission/self',
        name: 'self',
        meta: {
            title: '个人中心'
        },
        component: User
    },

    {
        path: '/tabs',
        name: 'tabs',
        meta: {
            title: '消息'
        },
        component: () => import("@/views/tabs.vue")
    }
]
const homeRoutes = {
    path: '/',
    name: 'Home',
    component: Home,
    children: [],
};

const router = createRouter({
    history: createWebHashHistory(),
    routes: defaultRoutes
});

const modules = import.meta.glob('@/views/*/*.vue')
const resolveRoute = (path: string) => {
    let isFind = false

    const rs = getDataS("route")
    if (rs !== null) {
        const localRoutes = JSON.parse(rs)
        const menu = []
        homeRoutes.children = []
        // @ts-ignore
        homeRoutes.children.push(...defaultHomeRoutes)

        isFind = defaultHomeRoutes.some(it=>it.path===path)
        for (const lr of localRoutes.children) {
            const str = modules['/src/views' + lr.path + ".vue"]
            if (str) {
                lr.component = str
                // @ts-ignore
                homeRoutes.children.push(lr)
                if (path === lr.path) {
                    isFind = true
                }
            }

        }
        // 解析路由
        router.addRoute(homeRoutes)
    }
    return isFind
}
const searchPath = (path: string) => {
    const routes = router.getRoutes();
    for (const r of routes) {
        if (path === r.path) {
            return true;
        }
        if (r.children) {
            for (const cr of r.children) {
                if (path === cr.path) {
                    return true;
                }
            }
        }

    }
    return false
}
router.beforeEach((to, from, next) => {
    //document.title = `${to.meta.title} `;
    const role = getDataS('token');
    if (!role && to.path !== '/login') {
        next('/login');
    } else {
        if (!searchPath(to.path)) {
            if (resolveRoute(to.path)) {
                next(to.path)
            } else {
                next("/")
            }

        } else {
            next();
        }
    }
});


export {router, homeRoutes, defaultHomeRoutes} ;

