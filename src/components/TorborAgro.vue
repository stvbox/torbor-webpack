<template>
    <div id="torbo-app" >

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Маршрутизатотрон</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a @click="addRoute()" href="#" class="nav-link">Еще маршрут <span class="sr-only">(current)</span></a>
                    </li>
                </ul>
            </div>
        </nav>

        <routecalc v-for="route in routes" :data="route" ></routecalc>

        <div>
        <table class="table">
            <tbody>
                <tr v-for="route in routesLog" >
                    <td>{{route.date}}</td>
                    <td>{{route.info}}</td>
                    <td>{{route.dist}}</td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script>
import routecalc from './RouteCalc'
import dataService from './DataService'

export default {
  name: 'TorborAgro',
  components: { routecalc },
  mixins: [dataService],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>