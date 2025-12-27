import { useSelector } from 'react-redux';
import { Container, Card, Button } from 'react-bootstrap';
import Hero from '../components/Hero';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Hero />;
  }

  return (
    <div className='py-5'>
      <Container>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-100 mx-auto' style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 className='text-center mb-3'>
            Welcome back, <span className='text-primary'>{userInfo.name}</span>!
          </h1>
          <p className='text-center text-muted mb-4' style={{ fontSize: '1.1rem' }}>
            Stay focused. Master one topic at a time. Every subtopic completed is a step closer to your goals.
          </p>
          <div className='alert alert-info text-center mb-4' role='alert'>
            <strong>Tip:</strong> Track your progress and organize your learning journey.
          </div>
          <div className='d-flex gap-3 flex-wrap justify-content-center'>
            <Button
              variant='primary'
              href='/topics'
              className='px-4 py-2'
              style={{ minWidth: '150px' }}
            >
              Go to Topics
            </Button>
            <Button
              variant='success'
              href='/progress'
              className='px-4 py-2'
              style={{ minWidth: '150px' }}
            >
              View Progress
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default HomeScreen;
