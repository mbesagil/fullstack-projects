
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, selectCount } from '../stores/counterSlice'

function Count1() {

    const count = useSelector(selectCount);
    const dispatch = useDispatch();

    return (
        <>
            <div className='border border-dotted '>
                <div className='flex flex-col'>
                    <div>
                        <div>
                            <button className='bg-purple-500 p-2 rounded-md' aria-label="Increment value" onClick={() => dispatch(increment())}>
                                Increment
                            </button>
                            
                            <button className='bg-red-500 p-2 rounded-md' aria-label="Decrement value" onClick={() => dispatch(decrement())}>
                                Decrement
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Count1
