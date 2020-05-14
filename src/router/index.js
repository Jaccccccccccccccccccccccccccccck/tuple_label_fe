import Vue from 'vue'
import VueRouter from 'vue-router'
import annotation from '../components/annotation/annotation'
import document_list from '../components/document/document_list'
import index from '../components/index'
import create_label from '../components/label/create_label'
import label_list from '../components/label/label_list'
import create_project from '../components/project/create_project'
import data_export from '../components/project/data_export'
import data_import from '../components/project/data_import'
import project_base from '../components/project/project_base'
import project_list from '../components/project/project_list'
import project_status from '../components/project/project_status'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/management/project_list"
  },
  {
    path: '/management/',
    component: index,
    children: [
      {
        path: 'project_list',
        component: project_list
      },
      {
        path: 'create_project',
        component: create_project
      },
      {
        path: 'label_list',
        component: label_list
      },
      {
        path: 'create_label',
        component: create_label
      }
    ]
  },
  {
    path: '/project/:id/',
    component: project_base,
    children: [
      {
        path: 'labels',
        component: label_list
      },
      {
        path: 'documents',
        component: document_list
      },
      {
        path: 'status',
        component: project_status
      },
      {
        path: 'import',
        component: data_import
      },
      {
        path: 'export',
        component: data_export
      },
    ]
  },
  {
    path: '/annotation/:id/',
    component: annotation
  }
]

const router = new VueRouter({
  routes
})

export default router
