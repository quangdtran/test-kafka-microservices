const express = require('express');
const router = express.Router();
const kafka = require('kafka-node');

const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'kafka:9092', autoConnect: true });
const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
// const kafkaClient = new kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'producer-client', kafkaClientOptions);
const kafkaProducer = new kafka.Producer(kafkaClient);

kafkaClient.on('error', (error) => console.error('Kafka client error:', error));
kafkaProducer.on('error', (error) => console.error('Kafka producer error:', error));
kafkaProducer.on('ready', err => console.log(err));

/* GET home page. */
router.get('/', function(req, res, next) {
  const payload = [{
    topic: 'test-topic',
    messages: JSON.stringify({ status: true }),
    attributes: 1
  }];
  kafkaProducer.send(payload, (err, result) => {
    if (err) {
      res.render('index', { title: 'Express' });
      return console.log(err);
    }
    res.json(result);
  });
});

module.exports = router;
