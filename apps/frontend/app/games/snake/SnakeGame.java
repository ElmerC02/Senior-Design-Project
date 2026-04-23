import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Random;

public class SnakeGame extends JPanel implements ActionListener, KeyListener {

    private static final int BOX_SIZE = 20;
    private static final int WIDTH = 400;
    private static final int HEIGHT = 400;
    private static final int DELAY = 125;

    private ArrayList<Point> snake;
    private Point food;
    private String direction;
    private int score;
    private Timer timer;

    private boolean gameOver = false;
    private boolean paused = false;
    private PausedState pausedState;

    private JLabel scoreLabel;
    private JButton restartButton, continueButton;
    private JFrame frame;

    private double correctAnswer;
    private JDialog mathDialog;
    private JLabel questionLabel;
    private JTextField answerField;

    public SnakeGame() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT));
        setBackground(Color.BLACK);
        setFocusable(true);
        addKeyListener(this);

        initUI();
        initGame();
    }

    private void initUI() {
        frame = new JFrame("Snake Game with Math Challenge");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());
        frame.add(this, BorderLayout.CENTER);

        JPanel controlPanel = new JPanel();
        controlPanel.setBackground(Color.DARK_GRAY);
        scoreLabel = new JLabel("Score: 0");
        scoreLabel.setForeground(Color.WHITE);
        restartButton = new JButton("Restart");
        continueButton = new JButton("Continue");
        continueButton.setEnabled(false);

        controlPanel.add(scoreLabel);
        controlPanel.add(restartButton);
        controlPanel.add(continueButton);

        frame.add(controlPanel, BorderLayout.SOUTH);

        restartButton.addActionListener(e -> initGame());
        continueButton.addActionListener(e -> askMathQuestion());

        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private void initGame() {
        snake = new ArrayList<>();
        snake.add(new Point(9 * BOX_SIZE, 10 * BOX_SIZE));
        direction = "RIGHT";
        score = 0;
        food = randomFoodAvoidingSnake(snake);
        gameOver = false;
        paused = false;
        continueButton.setEnabled(false);
        scoreLabel.setText("Score: " + score);

        if (timer != null) timer.stop();
        timer = new Timer(DELAY, this);
        timer.start();

        requestFocusInWindow();
        repaint();
    }

    private Point randomFoodAvoidingSnake(ArrayList<Point> snakeBody) {
        Random rand = new Random();
        Point newFood;
        do {
            int x = rand.nextInt(WIDTH / BOX_SIZE) * BOX_SIZE;
            int y = rand.nextInt(HEIGHT / BOX_SIZE) * BOX_SIZE;
            newFood = new Point(x, y);
        } while (snakeBody.contains(newFood));
        return newFood;
    }

    private void askMathQuestion() {
        if (mathDialog != null && mathDialog.isShowing()) return;

        mathDialog = new JDialog(frame, "Answer to Continue", true);
        mathDialog.setLayout(new GridLayout(4, 1, 10, 10));
        mathDialog.setSize(300, 200);
        mathDialog.setLocationRelativeTo(frame);

        String[] ops = {"+", "-", "*", "/"};
        Random rand = new Random();
        String op = ops[rand.nextInt(ops.length)];
        int num1 = rand.nextInt(10) + 1;
        int num2 = rand.nextInt(10) + 1;
        if (op.equals("/")) num1 = num1 * num2;

        correctAnswer = eval(num1, num2, op);

        questionLabel = new JLabel("Solve: " + num1 + " " + op + " " + num2 + " = ?");
        questionLabel.setForeground(Color.WHITE);
        questionLabel.setHorizontalAlignment(SwingConstants.CENTER);

        answerField = new JTextField();
        JButton submit = new JButton("Submit");

        answerField.addActionListener(e -> checkAnswer());
        submit.addActionListener(e -> checkAnswer());

        mathDialog.add(questionLabel);
        mathDialog.add(answerField);
        mathDialog.add(submit);

        mathDialog.getContentPane().setBackground(Color.BLACK);
        mathDialog.setVisible(true);
    }

    private double eval(int a, int b, String op) {
        switch (op) {
            case "+": return a + b;
            case "-": return a - b;
            case "*": return a * b;
            case "/": return (double) a / b;
        }
        return 0;
    }

    private void checkAnswer() {
        try {
            double user = Double.parseDouble(answerField.getText().trim());
            if (Math.abs(user - correctAnswer) < 0.001) {
                mathDialog.dispose();
                resumeGame();
            } else {
                JOptionPane.showMessageDialog(frame, "Incorrect answer! Try again.");
                answerField.setText("");
            }
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(frame, "Please enter a valid number.");
        }
    }

    private void resumeGame() {
        if (pausedState != null) {
            spawnNewSnakeAfterContinue();
        }
    }

    private void spawnNewSnakeAfterContinue() {
        if (pausedState == null) return;

        ArrayList<Point> oldSnake = pausedState.snakeBody;
        int previousScore = pausedState.score;
        String prevDirection = pausedState.direction;

        // Center position for new snake head
        int centerX = WIDTH / 2;
        int centerY = HEIGHT / 2;

        // Keep the same length
        int snakeLength = oldSnake.size();

        // Create new snake body aligned with its previous direction
        snake = new ArrayList<>();

        for (int i = 0; i < snakeLength; i++) {
            int x = centerX;
            int y = centerY;

            switch (prevDirection) {
                case "RIGHT":
                    x = centerX - i * BOX_SIZE;
                    y = centerY;
                    break;
                case "LEFT":
                    x = centerX + i * BOX_SIZE;
                    y = centerY;
                    break;
                case "UP":
                    x = centerX;
                    y = centerY + i * BOX_SIZE;
                    break;
                case "DOWN":
                    x = centerX;
                    y = centerY - i * BOX_SIZE;
                    break;
            }

            snake.add(new Point(x, y));
        }

        direction = prevDirection;
        score = previousScore;
        scoreLabel.setText("Score: " + score);

        food = randomFoodAvoidingSnake(snake);

        gameOver = false;
        paused = false;
        continueButton.setEnabled(false);

        timer.start();
        requestFocusInWindow();
        repaint();
    }

    private boolean collision(Point head) {
        for (int i = 1; i < snake.size(); i++) {
            if (snake.get(i).equals(head)) return true;
        }
        return false;
    }

    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);

        for (int i = 0; i < snake.size(); i++) {
            g.setColor(i == 0 ? Color.GREEN : new Color(0, 128, 0));
            g.fillRect(snake.get(i).x, snake.get(i).y, BOX_SIZE, BOX_SIZE);
        }

        g.setColor(Color.RED);
        g.fillRect(food.x, food.y, BOX_SIZE, BOX_SIZE);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (gameOver || paused) return;

        Point head = snake.get(0);
        int headX = head.x;
        int headY = head.y;

        switch (direction) {
            case "LEFT": headX -= BOX_SIZE; break;
            case "RIGHT": headX += BOX_SIZE; break;
            case "UP": headY -= BOX_SIZE; break;
            case "DOWN": headY += BOX_SIZE; break;
        }

        Point newHead = new Point(headX, headY);

        if (headX < 0 || headX >= WIDTH || headY < 0 || headY >= HEIGHT || collision(newHead)) {
            gameOver = true;
            timer.stop();
            JOptionPane.showMessageDialog(frame, "Game Over! Final Score: " + score);
            continueButton.setEnabled(true);

            pausedState = new PausedState(new ArrayList<>(snake), score, direction);
            return;
        }

        if (newHead.equals(food)) {
            score++;
            scoreLabel.setText("Score: " + score);
            food = randomFoodAvoidingSnake(snake);
        } else {
            snake.remove(snake.size() - 1);
        }

        snake.add(0, newHead);
        repaint();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        int key = e.getKeyCode();
        switch (key) {
            case KeyEvent.VK_LEFT:
                if (!direction.equals("RIGHT")) direction = "LEFT";
                break;
            case KeyEvent.VK_RIGHT:
                if (!direction.equals("LEFT")) direction = "RIGHT";
                break;
            case KeyEvent.VK_UP:
                if (!direction.equals("DOWN")) direction = "UP";
                break;
            case KeyEvent.VK_DOWN:
                if (!direction.equals("UP")) direction = "DOWN";
                break;
        }
    }

    @Override public void keyReleased(KeyEvent e) {}
    @Override public void keyTyped(KeyEvent e) {}

    public static void main(String[] args) {
        SwingUtilities.invokeLater(SnakeGame::new);
    }

    static class PausedState {
        ArrayList<Point> snakeBody;
        int score;
        String direction;

        PausedState(ArrayList<Point> snake, int score, String direction) {
            this.snakeBody = new ArrayList<>(snake);
            this.score = score;
            this.direction = direction;
        }
    }
}
